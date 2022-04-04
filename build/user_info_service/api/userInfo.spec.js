"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Test cases for
 * 1. Publish Form
 * 2. Story
 */
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var chai_1 = __importDefault(require("chai"));
var chai_http_1 = __importDefault(require("chai-http"));
var server_1 = require("../server/server");
var sinon_chai_1 = __importDefault(require("sinon-chai"));
var uuid_1 = require("uuid");
var jwtUtils_1 = require("../../auth_service/utils/jwtUtils");
// test MANUALLY
chai_1.default.use(chai_http_1.default);
chai_1.default.use(sinon_chai_1.default);
var PORT = 3000;
var app = server_1.server.start(PORT);
process.on('uncaughtException', function (e) {
    console.log('error is ' + e.message);
    console.log('exiting.....');
    process.exit(1);
});
describe('Test Cases for Story create and Publish', function () {
    var token = jwtUtils_1.utils.issueAccessTokenJWT({
        email: 'abc@gmail.com',
        id: uuid_1.v4()
    });
    xit('Create a basic story', function (done) {
    });
    xit('Add image to story', function (done) {
    });
    xit('Add video to story', function (done) {
    });
    xit('remove video from story', function (done) {
    });
    xit('remove image from story', function (done) {
    });
    xit('update existing line of text', function (done) {
    });
    xit('move paragraph up or down', function (done) {
    });
    xit('delete text', function (done) {
    });
    xit('delete whole paragraph', function (done) {
    });
    xit('delete whole paragraph and replace it with a new text', function (done) {
    });
    xit('Try to submit empty publish form', function (done) {
    });
    xit('Try to submit form without thumbnail', function (done) {
    });
    xit('Try to submit form without title', function (done) {
    });
    xit('Try to submit form without location', function (done) {
    });
    xit('Try to submit form without tags', function (done) {
    });
    xit('Try to submit form without type', function (done) {
    });
    xit('Try to submit form without summary', function (done) {
    });
    xit('Try to submit form with summary more than 150chars', function (done) {
    });
    xit('Try to submit form with title more than 150chars', function (done) {
    });
    xit('Try to submit form with thumnail more than 2MB', function (done) {
    });
});
