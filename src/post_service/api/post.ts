import { json, NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import { v4 as uuidv4, parse as uuidParse, stringify as uuidStringify } from 'uuid';
import { RequestWithPayload } from "../../auth_service/utils";
import { convertTime } from "../../auth_service/utils/general";
import { utils } from "../../auth_service/utils/jwtUtils";
import { Database } from "../../database";

const postRouter: Router = Router();

const AUTHOR_ID = 'author_id',
    FULL_STORY = 'full_story',
    CREATED_AT = 'created_at',
    UUID = 'uuid',
    JSON_INSERT = 'JSON_INSERT',
    JSON_ARRAY_INSERT = 'JSON_ARRAY_INSERT',
    JSON_REPLACE = 'JSON_REPLACE',
    JSON_REMOVE = 'JSON_REMOVE';

type User = {email:string, id:string, iat:number|Date|string, exp:number|Date|string, aud:string, iss: string}

postRouter.post('/create-post', utils.verifyAccessToken, async (req_:Request, res: Response, next:NextFunction) => {
    // 1. if user is invalid / null  return
    // 2. create new entry in db
    try {
        const req = req_ as RequestWithPayload;
        const payload:User = req['payload'] as User;
        const db = Database.getDBQueryHandler();
        const dbRes = await db.insertWithValues(
            "INSERT INTO `user_to_post` SET ?", {
                [AUTHOR_ID]: Buffer.from(uuidParse(payload['id'])),
                [FULL_STORY]: JSON.stringify(req.body.postStory),
                [CREATED_AT]: convertTime()
            } 
        );
        res.status(200).json({
            success: true,
            post_id: dbRes[0]['insertId']
        });
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
    const map = new Map<string, any[]|undefined>([
        ['add', []],
        ['replace', []],
        ['delete', []]
    ]);
    const parsePath = (path: string) => {
        let result:string = "$";
        const arr = path.split('/').slice(1);
        // if its not a number then we are going to add into JSON Object, else add into JSON Array
        arr.forEach((item, index) => {
            result += Number.isInteger(item) ? `[${item}]` : index == 0 ? `${item}` : `.${item}`;
        });
        return {mode: Number.isNaN(arr[arr.length - 1]) ? 'object' : 'array', jsonPath: result};
    }
    jsonPatch.forEach((item: {'op': string, 'path': string, value: any}) => {
        const {mode, jsonPath} = parsePath(item.path);
        switch(item.op) {
            case 'add':
                map.set('add', map.get('add')?.concat(jsonPath, Array.isArray(item.value) ? `CAST('[${item.value.toString()}]' AS JSON)`
                :   typeof item.value == 'object' ? `CAST('${JSON.stringify(item.value)}' AS JSON)` : item.value));
                break;
            case 'replace':
                map.set('replace', map.get('replace')?.concat(jsonPath, Array.isArray(item.value) ? `CAST('[${item.value.toString()}]' AS JSON)`
                :   typeof item.value == 'object' ? `CAST('${JSON.stringify(item.value)}' AS JSON)` : item.value));
                break;
            case 'delete':
                map.set('delete', map.get('delete')?.concat(jsonPath));
                break;
            default:
                return;
        }
    });
    
}

postRouter.patch('/update-post', utils.verifyAccessToken, async (req_: Request, res: Response, next:NextFunction) => {
    try {
        const req = req_ as RequestWithPayload;
        const payload:User = req['payload'] as User;
        const db = Database.getDBQueryHandler();
        const jsonPatch = req.body;
        console.log(req.body);
        await db.updateWithValues(
            `UPDATE user_to_post SET data=? WHERE ${AUTHOR_ID}=?`, {

                [AUTHOR_ID]: Buffer.from(uuidParse(payload['id']))
            }
        );
        res.status(200).json({
            success: true
        });
    } catch(e) {

    } 
});

postRouter.get('/publish-post', () => {

});

postRouter.get('/view-post', () => {

});
postRouter.delete('/delete-post', () => {

});
export default postRouter;
