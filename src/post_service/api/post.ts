import { Request, Response, Router } from "express";
import { RequestWithPayload } from "../../auth_service/utils";
import { convertTime } from "../../auth_service/utils/general";
import { utils } from "../../auth_service/utils/jwtUtils";
import { Database } from "../../database";

const postRouter: Router = Router();

const AUTHOR_ID = 'author_id',
    FULL_STORY = 'full_story',
    CREATED_AT = 'created_at';


postRouter.post('/create-post', utils.verifyAccessToken, async (req_:Request, res: Response) => {
    // 1. if user is invalid / null  return
    // 2. create new entry in db
    const req = req_ as RequestWithPayload;
    const db = Database.getDBQueryHandler();
    const dbRes = await db.insertWithValues(
        `INSERT INTO user_to_post (${AUTHOR_ID}, ${FULL_STORY}, ${CREATED_AT}) VALUES(?, ?, ?)`, 
        ['', {}, convertTime()]
    );
    res.send(200)
    // 3. return sucess
});

postRouter.patch('/update-post', () =>{

});

postRouter.get('/publish-post', () => {

});

postRouter.get('/view-post', () => {

});
postRouter.delete('/delete-post', () => {

});
export default postRouter;
