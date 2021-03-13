import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { parse as uuidParse } from 'uuid';
import { RequestWithPayload } from "../../auth_service/utils";
import { convertTime } from "../../auth_service/utils/general";
import { utils } from "../../auth_service/utils/jwtUtils";
import Busboy from 'busboy';
import PQueue from 'p-queue';
import awsSdk from 'aws-sdk';
import SQL_DB from "../../database";

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

const AUTHOR_ID = 'author_id',
    FULL_STORY = 'full_story',
    CREATED_AT = 'created_at',
    ID='id',
    TITLE= 'title',
    THUMBNAIL='thumbnail',
    SUMMARY='summary',
    TAGS='tags',
    LOCATION='location',
    TYPE='type',
    FULL_STORY_ID='full_story_id',
    PUBLISH_STATUS='publish_status',
    MEDIA_URL = 'media_url';

type User = {email:string, id:string, iat:number|Date|string, exp:number|Date|string, aud:string, iss: string}

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
        switch(item.op) {
            case 'add':
                map.push(`JSON_SET(${FULL_STORY}, '${jsonPath}', ${Array.isArray(item.value) ? `CAST('[${item.value.toString()}]' AS JSON)`
                :   typeof item.value == 'object' ? `CAST('${JSON.stringify(item.value)}' AS JSON)` : `${Number.isNaN(+item.value) ? `"${item.value}"` : item.value}`})`);
                break;
            case 'replace':
                map.push(`JSON_REPLACE(${FULL_STORY}, '${jsonPath}', ${Array.isArray(item.value) ? `CAST('[${item.value.toString()}]' AS JSON)`
                :   typeof item.value == 'object' ? `CAST('${JSON.stringify(item.value)}' AS JSON)` : `${Number.isNaN(+item.value) ? `"${item.value}"` : item.value}`})`);
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


postRouter.patch('/update-post', utils.verifyAccessToken, async (req_: Request, res: Response, next:NextFunction) => {
    try {
        const req = req_ as RequestWithPayload;
        const payload:User = req['payload'] as User;
        const db = new SQL_DB();
        const jsonPatch:{storypatchData: any, postId: number} = req.body;
        const sqlQuery = {
            query: 'UPDATE user_to_post SET ',
            values: [] as Array<any>
        };
        const authorID = Buffer.from(uuidParse(payload['id']));
        generateSQLStatements(jsonPatch.storypatchData).forEach(item => {
            sqlQuery.query += `${FULL_STORY}=${item},`;
        });
        sqlQuery.query = `${sqlQuery.query.slice(0, -1)} WHERE ${AUTHOR_ID}=? AND ${ID}=?`;
        sqlQuery.values.push(authorID, jsonPatch.postId);
        await db.exec(db.TYPES.UPDATE_JSON, sqlQuery.query, sqlQuery.values);
        res.status(200).json({
            success: true
        });
    } catch(err) {
        next(err);
    } 
});

postRouter.post('/publish-post', utils.verifyAccessToken, async (req_: Request, res: Response, next:NextFunction) => {
    try {
        const busboy = new Busboy({
            headers: req_.headers,
            limits: {
                files: 1,
                fileSize: thumbSize
            }
        });
        let limit_reach = false;
        const chunks: any[] = [];
        const req = req_ as RequestWithPayload;
        const db = new SQL_DB();
        const formPayload: PublishForm = {} as PublishForm;
        let fieldParesed = 0;
        let _encoding='', _mimeType='';
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

        busboy.on('field', (fieldname, val) => {
            handleErrorBusBoy(() => {
                switch(fieldname) {
                    case 'postId':
                        if (val == null || val == undefined || Number.isNaN(+val)) {
                            next(new createHttpError.InternalServerError('postId not found'));
                        }
                        fieldParesed++;
                        formPayload.postId = val;
                        break;
                    case 'title':
                        if (val == null || val == undefined || val.length == 0 || val.length > 150) {
                            next(new createHttpError.InternalServerError('title is null or exceeds 150 char length'));
                        }
                        fieldParesed++;
                        formPayload.title = val;
                        break;
                    case 'summary':
                        if (val == null || val == undefined || val.length == 0 || val.length > 150) {
                            next(new createHttpError.InternalServerError('summary is null or exceeds 150 char length'));
                        }
                        fieldParesed++;
                        formPayload.summary = val;
                        break;
                    case 'location':
                        if (val == null || val == undefined || val.length == 0 || val.length > 50) {
                            next(new createHttpError.InternalServerError('location is null or exceeds 50 char length'));
                        }
                        fieldParesed++;
                        formPayload.location = val;
                        break;
                    case 'tags':
                        const _val = JSON.parse(val);
                        if (val == null || val == undefined || _val.length == 0 || _val.length > 5
                            || _val.findIndex((e:string) => typeof e != 'string') != -1) {
                            next(new createHttpError.InternalServerError('tags is null or exceeds 5 array length or make sure its all string'));
                        }
                        fieldParesed++;
                        formPayload.tags = val;
                        break;
                    case 'type':
                        if (val == null || val == undefined || !(val in ArticleType)) {
                            next(new createHttpError.InternalServerError('type is null or not supported'));
                        }
                        fieldParesed++;
                        formPayload.type = val;
                        break;
                }
            });
        });
        busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
            _mimeType = mimetype;
            _encoding = encoding;
            handleErrorBusBoy(() => {
                if (fieldParesed != 6) {
                    next(new createHttpError.InternalServerError('fields must be parsed first'));
                } else {
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
                        next(new createHttpError.InternalServerError('thumbnail is not proper image only supports .png'));
                    }
                }
            })
        });
        busboy.on('finish', () => {
            handleErrorBusBoy(async () => {
                if (limit_reach) {
                    next(new createHttpError[413]);
                } else {
                    // save to s3
                    const params: awsSdk.S3.Types.PutObjectRequest = {
                        Bucket: `${process.env.AWS_S3_BUCKETNAME}`,
                        Key: `thumbs/${formPayload.postId}.png`,
                        Body: Buffer.concat(chunks),
                        ContentType: _mimeType,
                        ContentEncoding: _encoding,
                        ACL: 'public-read'
                    };
                    
                    s3.upload(params, async (err, _res) => {
                        if(err) next(new createHttpError.InternalServerError('something went wrong in s3: ' + err.message));
                        else {
                            //save to DB
                            try {
                                await db.exec(db.TYPES.INSERT,
                                    "INSERT INTO `post` SET ?", {
                                        [TITLE]: formPayload.title,
                                        [THUMBNAIL]: _res.Location,
                                        [SUMMARY]: formPayload.summary,
                                        [TAGS]: JSON.stringify(formPayload.tags),
                                        [LOCATION]: formPayload.location,
                                        [TYPE]: formPayload.type,
                                        [FULL_STORY_ID]: formPayload.postId,
                                        [PUBLISH_STATUS]: PublishStatus.UNDER_REVIEW,
                                        [CREATED_AT]: convertTime()
                                    } 
                                );
                                res.status(200).json({
                                    success: true
                                });
                            } catch(err) {
                                next(err);
                            }
                        }  
                    });
                }
            });
        })
        req_.pipe(busboy);
    } catch(err) {
        next(err);
    } 
});

postRouter.get('/view-post', () => {

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
            const sqlQuery = `SELECT * FROM user_to_post WHERE ${AUTHOR_ID}=? AND ${ID}=?`;
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
postRouter.delete('/delete-post', () => {

});
postRouter.post('/upload-media/image', utils.verifyAccessToken, (req_: Request, res: Response, next: NextFunction) => {
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
});
export default postRouter;
