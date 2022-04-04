import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { parse as uuidParse } from 'uuid';
import { RequestWithPayload } from "../../auth_service/utils";
import { convertTime } from "../../auth_service/utils/general";
import { utils } from "../../auth_service/utils/jwtUtils";
import Busboy from 'busboy';
import PQueue from 'p-queue';
import SQL_DB from "../../database";
import { AUTHOR_ID, FULL_STORY, CREATED_AT, ID, POST_ID, TITLE, THUMBNAIL, SUMMARY, TAGS, LOCATION, TYPE, FULL_STORY_ID, PUBLISH_STATUS, FIRST_NAME, MIDDLE_NAME, LAST_NAME, PROFILE_PIC_URL, UUID, LIKES, VIEWS, BOOKMARK_POST_ID, USER_UUID } from "../../database/fields";
import { isNullOrEmpty } from "../../helpers/util";

const postRouter: Router = Router();
const thumbSize = 1024 * 1024 * 2;
const imageSize = 1024 * 1024 * 5;
interface PublishForm {
    postId: number|string, 
    summary: string, 
    title: string, 
    location: string, 
    tags: Array<string>,
    type: string
}
enum ArticleType {
    ARTICLE = "ARTICLE",
    OPINION = "OPINION",
    EOD = "EOD"
}
enum PublishStatus {
    UNDER_REVIEW = "underReview",
    PUBLISHED = "published",
    DISCARDED = "discarded",
    REMOVED = "removed"
}

type User = {email:string, id:string, iat:number|Date|string, exp:number|Date|string, aud:string, iss: string};

const getUpdateValue = (val: any) => {
    if (isNullOrEmpty(val) && !Array.isArray(val)) return val;
    if (typeof val === "string" && Number.isNaN(+val)) {
        return `"${val.replace(/"/g, '\"').replace(/'/g, "\\'")}"`;
    }
    try {
        if (!isNullOrEmpty(val.text)) {
            val.text = val.text.replace(/"/g, '\"');    
        } else if (!isNullOrEmpty(val.data.text)) {
            val.data.text = val.data.text.replace(/"/g, '\\"');    
        }
    }catch(e) {}
    
    if (typeof val === "object") {
        return `CAST('${JSON.stringify(val).replace(/'/g, "\\'")}' AS JSON)`;
    }
   
    return val;
}

function generateSQLStatements(jsonPatch:any[]) {
    // 1. get pointer to that object
        // 2. parse the jsonPatch to 3 buckets add, delete, replace
        // 3. fill each bucket of the form array [$'path', 'value']
        // 4. if value is of form object or array replace 'value' -> CAST('value') as JSON 
    const map = [] as Array<string>;
    const parsePath = (path: string) => {
        let result:string = "$";
        const arr = path.split('/').slice(1);
        // if its not a number then we are going to add into JSON Object, else add into JSON Array
        arr.forEach((item) => {
            result += Number.isNaN(+item) ? `.${item}` : `[${item}]`;
        });
        return result;
    }
    jsonPatch.forEach((item: {'op': string, 'path': string, value: any}, index) => {
        const jsonPath = parsePath(item.path);
        const value = getUpdateValue(item.value);
        switch(item.op) {
            case 'add':
                map.push(`JSON_SET(${FULL_STORY}, '${jsonPath}', ${value})`);
                break;
            case 'replace':
                map.push(`JSON_REPLACE(${FULL_STORY}, '${jsonPath}', ${value})`);
                break;
            case 'delete':
                map.push(`JSON_REMOVE(${FULL_STORY}, '${jsonPath}')`);
                break;
            default:
                return;
        }
    });
    return map;
}

postRouter.post('/create-post', utils.verifyAccessToken, async (req_:Request, res: Response, next:NextFunction) => {
    // 1. if user is invalid / null  return
    // 2. create new entry in db
    try {
        const req = req_ as RequestWithPayload;
        const payload:User = req['payload'] as User;
        const db = new SQL_DB();
        const dbRes = await db.exec(db.TYPES.INSERT, "INSERT INTO `user_to_post` SET ?", {
            [AUTHOR_ID]: Buffer.from(uuidParse(payload['id'])),
            [FULL_STORY]: JSON.stringify(req.body.postStory),
            [CREATED_AT]: convertTime()
        });
        if (dbRes) {
            res.status(200).json({
                success: true,
                post_id: dbRes[0]['insertId']
            });
        } else {
            throw new createHttpError.InternalServerError('unable to create POST')
        }
        
    } catch(e) {
        next(e);
    }
    // 3. return sucess
});

postRouter.patch('/update-post', utils.verifyAccessToken, async (req_: Request, res: Response, next:NextFunction) => {
    const db = new SQL_DB();
    try {
        const req = req_ as RequestWithPayload;
        const payload:User = req['payload'] as User;
        const jsonPatch:{storypatchData: any, postId: number} = req.body;
        const authorID = Buffer.from(uuidParse(payload['id']));
        await db.connect();
        // if story is already published user cannot do it
        const response = await db.selectWithValues(
            `SELECT * from user_to_post WHERE ${AUTHOR_ID}=? AND ${ID}=? AND ${POST_ID} IS NULL`,
            [authorID, jsonPatch.postId]);
        if (response?.[0]?.length != 1) {
            throw new createHttpError.InternalServerError('Cannot be to Edited');
        }
        const sqlQuery = {
            query: 'UPDATE `user_to_post` SET ',
            values: [] as Array<any>
        };
        generateSQLStatements(jsonPatch.storypatchData).forEach(item => {
            sqlQuery.query += `${FULL_STORY}=?,`;
            sqlQuery.values.push(
                {
                    toSqlString: function () {
                        return item;
                    }
                }
            );
        });
        sqlQuery.query = `${sqlQuery.query.slice(0, -1)} WHERE ${AUTHOR_ID}=? AND ${ID}=?`;
        sqlQuery.values.push(authorID, jsonPatch.postId);
        const r = await db.updateJSONValues(sqlQuery.query, sqlQuery.values);
        res.status(200).json({
            success: true
        });
    } catch(err) {
        console.log(err);
        next(err);
    }finally {
        db.close();
    }
});

postRouter.post('/publish-post', utils.verifyAccessToken, async (req_: Request, res: Response, next:NextFunction) => {
    try {
        const busboy = new Busboy({
            headers: req_.headers,
            // limits: {
            //     files: 1,
            //     fileSize: thumbSize
            // }
        });
        // let limit_reach = false;
        // const chunks: any[] = [];
        const req = req_ as RequestWithPayload;
        const payload: User = req['payload'] as User;
        const db = new SQL_DB();
        const formPayload: PublishForm = {} as PublishForm;
        let fieldParesed = 0;
        // let _encoding='', _mimeType='';
        const workQueue = new PQueue({concurrency: 1});
        
        // const s3 = new awsSdk.S3({
        //     accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        //     secretAccessKey: process.env.AWS_S3_SECRET_KEY,
        // });

        const handleErrorBusBoy = async (fn: Function) => {
            workQueue.add(async () => {
                try {
                    await fn();
                } catch(err) {
                    req_.unpipe(busboy);
                    workQueue.pause();
                    next(err);
                }
            });
        };

        busboy.on('field', (fieldname, val) => {
            handleErrorBusBoy(() => {
                switch(fieldname) {
                    case 'postId':
                        if (val == null || val == undefined || Number.isNaN(+val)) {
                            next(new createHttpError.BadRequest('postId not found'));
                        }
                        fieldParesed++;
                        formPayload.postId = val;
                        break;
                    case 'title':
                        if (val == null || val == undefined || val.length == 0 || val.length > 150) {
                            next(new createHttpError.BadRequest('title is null or exceeds 150 char length'));
                        }
                        fieldParesed++;
                        formPayload.title = val;
                        break;
                    case 'summary':
                        if (val == null || val == undefined || val.length == 0 || val.length > 150) {
                            next(new createHttpError.BadRequest('summary is null or exceeds 150 char length'));
                        }
                        fieldParesed++;
                        formPayload.summary = val;
                        break;
                    case 'location':
                        if (val == null || val == undefined || val.length == 0 || val.length > 50) {
                            next(new createHttpError.BadRequest('location is null or exceeds 50 char length'));
                        }
                        fieldParesed++;
                        formPayload.location = val;
                        break;
                    case 'tags':
                        const _val = JSON.parse(val);
                        if (val == null || val == undefined || _val.length == 0 || _val.length > 5
                            || _val.findIndex((e:string) => typeof e != 'string') != -1) {
                            next(new createHttpError.BadRequest('tags is null or exceeds 5 array length or make sure its all string'));
                        }
                        fieldParesed++;
                        formPayload.tags = val;
                        break;
                    // case 'type':
                    //     if (val == null || val == undefined || !(val in ArticleType)) {
                    //         next(new createHttpError.InternalServerError('type is null or not supported'));
                    //     }
                    //     fieldParesed++;
                    //     formPayload.type = val;
                    //     break;
                }
            });
        });
        // busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        //     _mimeType = mimetype;
        //     _encoding = encoding;
        //     handleErrorBusBoy(() => {
        //         if (fieldParesed != 6) {
        //             next(new createHttpError.InternalServerError('fields must be parsed first'));
        //         } else {
        //             const fileTypes = /png/;
        //             const extname = fileTypes.test(filename);
        //             const mimeType = fileTypes.test(mimetype);
        //             if (extname && mimeType) {
        //                 file.on('data', (data) => {
        //                     chunks.push(data);
        //                 });
        //                 file.on('limit', () => {
        //                     chunks.length = 0;
        //                     limit_reach = true;
        //                 });
        //             } else {
        //                 next(new createHttpError.InternalServerError('thumbnail is not proper image only supports .png'));
        //             }
        //         }
        //     })
        // });
        busboy.on('finish', () => {
            handleErrorBusBoy(async () => {
                // if (limit_reach) {
                //     next(new createHttpError[413]);
                // } else {
                //     // save to s3
                //     const params: awsSdk.S3.Types.PutObjectRequest = {
                //         Bucket: `${process.env.AWS_S3_BUCKETNAME}`,
                //         Key: `thumbs/${formPayload.postId}.png`,
                //         Body: Buffer.concat(chunks),
                //         ContentType: _mimeType,
                //         ContentEncoding: _encoding,
                //         ACL: 'public-read'
                //     };
                    
                //     s3.upload(params, async (err, _res) => {
                //         if(err) next(new createHttpError.InternalServerError('something went wrong in s3: ' + err.message));
                //         else {
                //             //save to DB
                //             try {
                //                 await db.exec(db.TYPES.INSERT,
                //                     "INSERT INTO `post` SET ?", {
                //                         [TITLE]: formPayload.title,
                //                         [THUMBNAIL]: _res.Location,
                //                         [SUMMARY]: formPayload.summary,
                //                         [TAGS]: JSON.stringify(formPayload.tags),
                //                         [LOCATION]: formPayload.location,
                //                         [TYPE]: formPayload.type,
                //                         [FULL_STORY_ID]: formPayload.postId,
                //                         [PUBLISH_STATUS]: PublishStatus.UNDER_REVIEW,
                //                         [CREATED_AT]: convertTime(),
                //                         [AUTHOR_ID]: Buffer.from(uuidParse(payload.id))  
                //                     } 
                //                 );
                //                 res.status(200).json({
                //                     success: true
                //                 });
                //             } catch(err) {
                //                 next(err);
                //             }
                //         }  
                //     });
                // }
                //save to DB
                try {
                    if (fieldParesed != 5) {
                        next(new createHttpError.BadRequest('Number of fields parsed does not match the expected count'));
                    } 
                    await db.connect();
                    const response = await db.insertWithValues(
                        "INSERT INTO `post` SET ?", {
                            [TITLE]: formPayload.title,
                            // [THUMBNAIL]: _res.Location,
                            [SUMMARY]: formPayload.summary,
                            [TAGS]: JSON.stringify(formPayload.tags),
                            [LOCATION]: formPayload.location,
                            [TYPE]: ArticleType.ARTICLE,
                            [FULL_STORY_ID]: formPayload.postId,
                            [PUBLISH_STATUS]: PublishStatus.PUBLISHED,
                            [CREATED_AT]: convertTime(),
                            [AUTHOR_ID]: Buffer.from(uuidParse(payload.id))  
                        } 
                    );
                    await db.updateWithValues(`UPDATE user_to_post SET ${POST_ID}=?`, [response[0].insertId]);
                    res.status(200).json({
                        success: true
                    });
                } catch(err) {
                    next(err);
                } finally {
                    db.close();
                }
            });
        })
        req_.pipe(busboy);
    } catch(err) {
        next(err);
    }
});

// Anonymous users
postRouter.get('/view-post', async (req_: Request, res: Response, next:NextFunction) => {
    const db = new SQL_DB();
    try {
        const req = req_ as RequestWithPayload;
        const postId = req.query.postId;
        const authorID = req.query.authorId as string;
        if (!postId) {
            next(new createHttpError.BadRequest("Post ID is null"));
        } else if (!authorID) {
            next(new createHttpError.BadRequest("User ID is null"));
        } else {
            const _authorID = Buffer.from(uuidParse(authorID));
            await db.connect();
            // 1. get Post and check conditions
            // 2. get User_To_post of that post
            // 3. get User info of that post
            const sqlQuery = `SELECT ${TITLE}, ${TAGS}, ${LOCATION}, ${LIKES}, ${VIEWS}, ${CREATED_AT} AS createdAt, ${FULL_STORY_ID} FROM post WHERE ${AUTHOR_ID}=? AND ${ID}=? AND ${PUBLISH_STATUS}=?`;
            const responsePost = await db.selectWithValues(sqlQuery, [_authorID, postId, PublishStatus.PUBLISHED]);
            if (responsePost?.[0]?.[0]) {
                const post = responsePost[0][0];
                post.tags = isNullOrEmpty(post.tags) ? [] : JSON.parse(post.tags);
                const _response = await Promise.all([
                    db.selectWithValues(`SELECT ${FULL_STORY} AS fullStory, ${ID} AS id FROM user_to_post WHERE ${AUTHOR_ID}=? AND ${ID}=?`, [_authorID, post[FULL_STORY_ID]]),
                    db.selectWithValues(`SELECT ${FIRST_NAME} AS firstName, ${MIDDLE_NAME} AS middleName, ${LAST_NAME} AS lastName, ${PROFILE_PIC_URL} AS profilePicUrl FROM user WHERE ${UUID}=?`, [_authorID]),
                ]);
                const userToPost = _response[0];
                const user = _response[1];
                if (userToPost?.[0]?.[0] && user?.[0]?.[0]) {
                    delete post[FULL_STORY_ID];
                    res.status(200).json({
                        postInfo: userToPost[0][0],
                        authorInfo: {...user[0][0], authorId: authorID},
                        metaInfo: post,
                    });
                } else {
                    next(new createHttpError.InternalServerError("Article not found"));
                }
            } else {
                next(new createHttpError.InternalServerError("Article not found"));
            }
        }
    }catch(err) {
        next(err);
    }finally {
        db.close();
    }
});

// authusers
postRouter.post('/view-post', utils.verifyAccessToken, async (req_: Request, res: Response, next:NextFunction) => {
    const db = new SQL_DB();
    try {
        const req = req_ as RequestWithPayload;
        const payload:User = req['payload'] as User;
        const postId = req.body.postId;
        const authorID = req.body.userId;
        const loginUserID = payload['id'];
        if (!postId) {
            next(new createHttpError.BadRequest("Post ID is null"));
        } else if (!authorID) {
            next(new createHttpError.BadRequest("User ID is null"));
        } else {
            const _authorID = Buffer.from(uuidParse(authorID));
            const _loginUserID = Buffer.from(uuidParse(loginUserID));
            await db.connect();
            // 1. get Post and check conditions
            // 2. get User_To_post of that post
            // 3. get User info of that post
            const isAuthorAndUserSame = loginUserID === authorID;
            const sqlQuery = `SELECT ${TITLE}, ${TAGS}, ${LOCATION}, ${LIKES}, ${VIEWS}, ${CREATED_AT} AS createdAt, ${FULL_STORY_ID} FROM post WHERE ${AUTHOR_ID}=? AND ${ID}=?${isAuthorAndUserSame ? "" : ` AND ${PUBLISH_STATUS}=?`}`;
            const sqlValue = [_authorID, postId];
            !isAuthorAndUserSame && sqlValue.push(PublishStatus.PUBLISHED);
            const responsePost = await db.selectWithValues(sqlQuery, sqlValue);
            if (responsePost?.[0]?.[0]) {
                const post = responsePost[0][0];
                post.tags = isNullOrEmpty(post.tags) ? [] : JSON.parse(post.tags);
                const _response = await Promise.all([
                    db.selectWithValues(`SELECT ${FULL_STORY} AS fullStory, ${ID} AS id FROM user_to_post WHERE ${AUTHOR_ID}=? AND ${ID}=?`, [_authorID, post[FULL_STORY_ID]]),
                    db.selectWithValues(`SELECT ${FIRST_NAME} AS firstName, ${MIDDLE_NAME} AS middleName, ${LAST_NAME} AS lastName, ${PROFILE_PIC_URL} AS profilePicUrl FROM user WHERE ${UUID}=?`, [_authorID]),
                    db.selectWithValues(`SELECT ${ID} FROM bookmark WHERE ${BOOKMARK_POST_ID}=? AND ${USER_UUID} = ?`, [postId, _loginUserID])
                ]);
                const userToPost = _response[0];
                const user = _response[1];
                const bookmark = _response[2];
                if (userToPost?.[0]?.[0] && user?.[0]?.[0]) {
                    delete post[FULL_STORY_ID];
                    res.status(200).json({
                        postInfo: userToPost[0][0],
                        authorInfo: {...user[0][0], authorId: authorID},
                        metaInfo: post,
                        isBookmarked: !!(bookmark?.[0]?.[0])
                    });
                } else {
                    next(new createHttpError.InternalServerError("Article not found"));
                }
            } else {
                next(new createHttpError.InternalServerError("Article not found"));
            }
        }
    }catch(err) {
        next(err);
    }finally {
        db.close();
    }
});
postRouter.get('/get-post', utils.verifyAccessToken, async (req_: Request, res: Response, next: NextFunction) => {
    try {
        const req = req_ as RequestWithPayload;
        const payload:User = req['payload'] as User;
        const postId = req.query.postId;
        if (!postId) {
            next(new createHttpError.InternalServerError("Post ID is null"));
        } else {
            const db = new SQL_DB();
            const authorID = Buffer.from(uuidParse(payload['id']));
            const sqlQuery = `SELECT * FROM user_to_post WHERE ${AUTHOR_ID}=? AND ${ID}=? AND ${POST_ID} IS NULL`;
            let response = await db.exec(db.TYPES.SELECT, sqlQuery, [authorID, postId]);
            if (response?.[0]?.[0]?.[FULL_STORY]) {
                res.status(200).json({
                    story: response[0][0][FULL_STORY]
                });
        
            } else {
                next(new createHttpError.InternalServerError("Story not found"));
            }
        }
        
    }catch(err) {
        next(err);
    }
});
/* postRouter.post('/upload-media/image', utils.verifyAccessToken, (req_: Request, res: Response, next: NextFunction) => {
    try {
        const req = req_ as RequestWithPayload;
        const busboy = new Busboy({
            headers: req_.headers,
            limits: {
                files: 1,
                fileSize: imageSize
            }
        });
        const workQueue = new PQueue({concurrency: 1});
        
        const s3 = new awsSdk.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_KEY,
        });

        const handleErrorBusBoy = async (fn: Function) => {
            workQueue.add(async () => {
                try {
                    await fn();
                } catch(err) {
                    req_.unpipe(busboy);
                    workQueue.pause();
                    next(err);
                }
            });
        };
        let _mimeType='', _encoding='', limit_reach = false, _filename='';
        const chunks: any[] = [];
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            _mimeType = mimetype;
            _encoding = encoding;
            _filename = filename;
            handleErrorBusBoy(() => {
                try {
                    const fileTypes = /png/;
                    const extname = fileTypes.test(filename);
                    const mimeType = fileTypes.test(mimetype);
                    if (extname && mimeType) {
                        file.on('data', (data) => {
                            chunks.push(data);
                        });
                        
                        file.on('limit', () => {
                            chunks.length = 0;
                            limit_reach = true;
                        });
                    } else {
                        throw new createHttpError.InternalServerError('only supported .png format');
                    }
                }catch(err) {
                    next(err);
                }
            });
        });
        busboy.on('finish', () => {
            handleErrorBusBoy(() => {
                if (limit_reach) {
                    next(new createHttpError[413]);
                } else {
                    const params: awsSdk.S3.Types.PutObjectRequest = {
                        Bucket: `${process.env.AWS_S3_BUCKETNAME}`,
                        Key: `images/${_filename}_${Date.now()}.png`,
                        Body: Buffer.concat(chunks),
                        ContentType: _mimeType,
                        ContentEncoding: _encoding,
                        ACL: 'public-read'
                    };
                    s3.upload(params, async (err, _res) => {
                        if (err) {
                            next(new createHttpError.InternalServerError('unable to store image to s3'));
                        } else {    
                            res.status(200).json({
                                success: true,
                                url: _res.Location,
                                key: _res.Key
                            });
                        }
                    });
                }
            })
        });
        req_.pipe(busboy);
    }catch(err) {
        next(err);
    }
});
postRouter.post('/upload-media/video', utils.verifyAccessToken, (req_: Request, res: Response, next: NextFunction) => {
    try {
        const req = req_ as RequestWithPayload;
        const busboy = new Busboy({
            headers: req_.headers,
            limits: {
                files: 1
            }
        });
        const workQueue = new PQueue({concurrency: 1});
        
        const s3 = new awsSdk.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_KEY,
        });

        const handleErrorBusBoy = async (fn: Function) => {
            workQueue.add(async () => {
                try {
                    await fn();
                } catch(err) {
                    req_.unpipe(busboy);
                    workQueue.pause();
                    next(err);
                }
            });
        };
        let _mimeType='', _encoding='', limit_reach = false, _filename='';
        const chunks: any[] = [];
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            _mimeType = mimetype;
            _encoding = encoding;
            _filename = filename;
            handleErrorBusBoy(() => {
                try {
                    const fileTypes = /mp4/;
                    const extname = fileTypes.test(filename);
                    const mimeType = fileTypes.test(mimetype);
                    if (extname && mimeType) {
                        file.on('data', (data) => {
                            chunks.push(data);
                        });
                    } else {
                        throw new createHttpError.InternalServerError('only supported .mp4 format');
                    }
                }catch(err) {
                    next(err);
                }
            });
        });
        busboy.on('finish', () => {
            handleErrorBusBoy(() => {
                const params: awsSdk.S3.Types.PutObjectRequest = {
                    Bucket: `${process.env.AWS_S3_BUCKETNAME}`,
                    Key: `videos/${_filename}_${Date.now()}.mp4`,
                    Body: Buffer.concat(chunks),
                    ContentType: _mimeType,
                    ContentEncoding: _encoding,
                    ACL: 'public-read'
                };
                s3.upload(params, async (err, _res) => {
                    if (err) {
                        next(new createHttpError.InternalServerError('unable to store video to s3'));
                    } else {    
                        res.status(200).json({
                            success: true,
                            url: _res.Location,
                            key: _res.Key
                        });
                    }
                });
            })
        });
        req_.pipe(busboy);
    }catch(err) {
        next(err);
    }
});
postRouter.post('/delete-media/image', utils.verifyAccessToken, (req_: Request, res: Response, next: NextFunction) => {
    // 1. connect to aws
    // 2. delete image
    try {
        const req = req_ as RequestWithPayload;      
        const db = new SQL_DB();
        const pattern = /^https:\/\/topselfnewsbucket.*.png$/;
        const regex = new RegExp(pattern);

        if (!req.body.mediaURL || !regex.test(req.body.mediaURL) ) {
            throw new createHttpError.InternalServerError('not a image URL');
        }
        if (!req.body.mediaKey || req.body.mediaKey.length < 1 || !req.body.mediaKey.startsWith('images/')) {
            throw new createHttpError.InternalServerError('Image file not found');
        }

        const postId = req.body.postId;
        const index = req.body.mediaKey.indexOf("images/");
        const filename = req.body.mediaKey.slice(index);
        const s3 = new awsSdk.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_KEY,
        });
        const params: awsSdk.S3.Types.DeleteObjectRequest = {
            Bucket: `${process.env.AWS_S3_BUCKETNAME}`,
            Key: `${filename}`,
        };
        s3.deleteObject(params, async (err, _res) => {
            if (err) {
                // save to DB for future cleanup
                await db.exec(db.TYPES.INSERT, "INSERT INTO `media_clean` SET ?", {
                    [FULL_STORY_ID]: postId,
                    [MEDIA_URL]: req.body.mediaURL
                });
                next(new createHttpError.InternalServerError('unable to delete image from s3'));
            } else {    
                res.status(200).json({
                    success: true,
                });
            }
        });
    }catch(err) {
        next(err);
    }
});
postRouter.post('/delete-media/video', utils.verifyAccessToken, (req_: Request, res: Response, next: NextFunction) => {
    // 1. connect to aws
    // 2. delete video
    try {
        const req = req_ as RequestWithPayload;      
        const db = new SQL_DB();
        const pattern = /^https:\/\/topselfnewsbucket.*.mp4$/;
        const regex = new RegExp(pattern);

        if (!req.body.mediaURL || !regex.test(req.body.mediaURL)) {
            throw new createHttpError.InternalServerError('not a video URL');
        }
        if (!req.body.mediaKey || req.body.mediaKey.length < 1 || !req.body.mediaKey.startsWith('videos/')) {
            throw new createHttpError.InternalServerError('Video file not found');
        }
        const postId = req.body.postId;
        const index = req.body.mediaKey.indexOf("videos/");
        const filename = req.body.mediaKey.slice(index);
        const s3 = new awsSdk.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_S3_SECRET_KEY,
        });
        const params: awsSdk.S3.Types.DeleteObjectRequest = {
            Bucket: `${process.env.AWS_S3_BUCKETNAME}`,
            Key: `${filename}`,
        };
        s3.deleteObject(params, async (err, _res) => {
            if (err) {
                // save to DB for future cleanup
                await db.exec(db.TYPES.INSERT, "INSERT INTO `media_clean` SET ?", {
                    [FULL_STORY_ID]: postId,
                    [MEDIA_URL]: req.body.mediaURL
                });
                next(new createHttpError.InternalServerError('unable to delete video from s3'));
            } else {    
                res.status(200).json({
                    success: true,
                });
            }
        });
    }catch(err) {
        next(err);
    }
}); */
export default postRouter;
