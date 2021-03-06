/**
 * Test cases for 
 * 1. Publish Form
 * 2. Story
 */
import dotenv from 'dotenv';
dotenv.config();
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import {server} from '../server/server';
import sinonChai from 'sinon-chai';
import { v4 as uuidv4 } from 'uuid';
import { utils } from '../../auth_service/utils/jwtUtils';


// test MANUALLY


chai.use(chaiHttp);
chai.use(sinonChai);
const PORT = 3000
const app = server.start(PORT);
process.on('uncaughtException', (e) => {
    console.log('error is ' + e.message);
    console.log('exiting.....');
    process.exit(1);
})
describe('Test Cases for Story create and Publish', () => {
    
    let token = utils.issueAccessTokenJWT({
        email: 'abc@gmail.com',
        id: uuidv4()
    });
    xit('Create a basic story', (done) => {
        
    });
    xit('Add image to story', (done) => {
        
    });
    xit('Add video to story', (done) => {
        
    });
    xit('remove video from story', (done) => {
        
    });
    xit('remove image from story', (done) => {
        
    });
    xit('update existing line of text', (done) => {
        
    });
    xit('move paragraph up or down', (done) => {
        
    });
    xit('delete text', (done) => {
        
    });
    xit('delete whole paragraph', (done) => {
        
    });
    xit('delete whole paragraph and replace it with a new text', (done) => {
        
    });
    xit('Try to submit empty publish form', (done) => {
        
    });
    xit('Try to submit form without thumbnail', (done) => {
        
    });
    xit('Try to submit form without title', (done) => {
        
    });
    xit('Try to submit form without location', (done) => {
        
    });
    xit('Try to submit form without tags', (done) => {
        
    });
    xit('Try to submit form without type', (done) => {
        
    });
    xit('Try to submit form without summary', (done) => {
        
    });
    xit('Try to submit form with summary more than 150chars', (done) => {
        
    });
    xit('Try to submit form with title more than 150chars', (done) => {
        
    });
    xit('Try to submit form with thumnail more than 2MB', (done) => {
        
    });
});