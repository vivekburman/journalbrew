/**
 * Test cases for 
 * 1. Login
 * 2. Logout
 * 3. Refresh Token
 * 4. Verify AccessToken
 * 5. verify RefreshToken
 * 6. Protected Route
 */
import dotenv from 'dotenv';
dotenv.config();
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { utils } from '../utils/jwtUtils';
import { Response, NextFunction } from 'express';
import {server} from '../server/server';
import path from 'path';
import fs from 'fs';
import jsonwebtoken, { TokenExpiredError } from 'jsonwebtoken';
import { RequestWithPayload } from '../utils';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import { v4 as uuidv4 } from 'uuid';

const token = uuidv4();

// const should_ = chai.should();
chai.use(chaiHttp);
chai.use(sinonChai);
const app = server.start(3000);
const pathToPrivateKeyAccessToken:string = path.join(__dirname, '../id_access_rsa_prv.pem');
const PRV_KEY_ACCESS_TOKEN:string = fs.readFileSync(pathToPrivateKeyAccessToken, 'utf-8');

const pathToPublicKeyAccessToken:string = path.join(__dirname, '../id_access_rsa_pub.pem');
const PUB_KEY_ACCESS_TOKEN:string = fs.readFileSync(pathToPublicKeyAccessToken, 'utf-8');

const pathToPrivateKeyRefreshToken:string = path.join(__dirname, '../id_refresh_rsa_prv.pem');
const PRV_KEY_REFRESH_TOKEN:string = fs.readFileSync(pathToPrivateKeyRefreshToken, 'utf-8');

const pathToPublicKeyRefreshToken:string = path.join(__dirname, '../id_refresh_rsa_pub.pem');
const PUB_KEY_REFRESH_TOKEN:string = fs.readFileSync(pathToPublicKeyRefreshToken, 'utf-8');
const createToken = (token: {email: string, iat: string | number | Date }, key: string, expiresIn:string) => {
    return jsonwebtoken.sign(token, key, {
        expiresIn: expiresIn,
        algorithm: 'RS256',
        issuer: 'topshelfnews.com',
    });
}
const verifyToken = (token: string, key: string ) => {
    return jsonwebtoken.verify(token, key);
}
process.on('uncaughtException', () => {
    console.log('exiting.....');
    process.exit(1);
})
describe('Test Cases for Authentication & Authorization and Auth Server', () => {
    let accessToken: {token: string, expires:string}, refreshToken: {token: string, expires:string, expiresInMs: number};
    it('Generate Access Token', (done) => {
        accessToken = utils.issueAccessTokenJWT({
            email: 'abc@gmail.com',
            id: uuidv4()
        });
        expect(accessToken.expires).equal('15m');
        expect(accessToken.token).to.be.a('string');
        done();
    });
    it('Verify Access Token', (done) => {
        const next = sinon.spy();
        utils.verifyAccessToken(
            {
                headers: {
                    'authorization': accessToken.token
                }
            } as unknown as RequestWithPayload,
            {} as Response,
            next as NextFunction
        );
        expect(next).to.have.been.called;
        done();
    });
    it('Generate Refresh Token', async () => {
        refreshToken = await utils.issueRefreshTokenJWT({
            email: 'abc@gmail.com',
            id: token
        });
        expect(refreshToken.expires).to.equal('1y');
    });
    it('Verify Refresh Token', async () => {
        const token = await utils.verifyRefreshToken(refreshToken.token);
        expect(token.id).to.equal(token);
    });
   it('Check Access Token Expired', () => {
        const token = createToken({
            email: 'abc@gmail.com',
            iat: Math.floor(Date.now() / (1000 * 60) - 16)
        }, PRV_KEY_ACCESS_TOKEN, '15m');
        const func = () => verifyToken(token, PUB_KEY_ACCESS_TOKEN);
        expect(func).to.throw(TokenExpiredError);
    });
    it('Check Refresh Token Expired', () => {
        const date_ = new Date();
        date_.setFullYear(date_.getFullYear() - 1);
        const token = createToken({
            email: 'abc@gmail.com',
            iat: (+date_) / 1000
        }, PRV_KEY_REFRESH_TOKEN, '1y');
        const func = () => verifyToken(token, PUB_KEY_REFRESH_TOKEN)
        expect(func).to.throw(TokenExpiredError);
    });
});