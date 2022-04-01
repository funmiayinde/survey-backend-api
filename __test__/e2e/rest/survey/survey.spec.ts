/* eslint-disable @typescript-eslint/no-explicit-any */
import supertest, { SuperTest } from 'supertest';
import app from '../../../../src/app';
import {  CREATED, OK } from '../../../../src/utils/codes';
import { expect } from 'chai';
import { TEST_SURVEY_URL } from '../../routes';
import { getSurveyObject } from '../../../_seeds/survey/survey.seed';

let server: SuperTest<any>;
let responseObj: any = null;
// Parent block
describe('Setup For Survey Test', () => {
    before(async () => {
        server = supertest(await app);
    });
    describe('Survey Endpoint Test ' + TEST_SURVEY_URL, () => {
        it('Should test create survey', async () => {
            const response = await server.post(TEST_SURVEY_URL)
                .send({ ...getSurveyObject() })
                .set('x-api-key', process.env.API_KEY || 'SurveyAPIKey')
                .expect('Content-type', 'application/json; charset=utf-8')
                .expect(CREATED);
            // console.log('response::', response.body);
            responseObj = response.body.data;
            expect(response).instanceof(Object);
            expect(response.body).instanceof(Object);
            expect(response.body._meta).instanceof(Object);
            expect(response.body._meta).have.property('status_code');
            expect(response.body._meta).have.property('success');
            expect(response.body.data).instanceof(Object);
            expect(response.body.data).have.property('name');
        });

        it('Should test get surveys', async () => {
            const response = await server.get(TEST_SURVEY_URL)
                .set('x-api-key', process.env.API_KEY || 'SurveyAPIKey')
                .expect(OK);
                console.log('responseObj::', responseObj);
            expect(response).instanceof(Object);
            expect(response.body).instanceof(Object);
            expect(response.body._meta).instanceof(Object);
            expect(response.body._meta).have.property('status_code');
            expect(response.body._meta).have.property('success');
            expect(response.body.data).instanceof(Array);
        });
        
        it('Should test submit survey', async () => {
            console.log('responseObj::', responseObj);
            const response = await server.post(`${TEST_SURVEY_URL}/submit`)
                .send([{ surveyId: responseObj.id, optionId: responseObj.options[0].id }])
                .set('x-api-key', process.env.API_KEY || 'SurveyAPIKey')
                .expect(OK);
            expect(response).instanceof(Object);
            expect(response.body).instanceof(Object);
            expect(response.body._meta).instanceof(Object);
            expect(response.body._meta).have.property('status_code');
            expect(response.body._meta).have.property('success');
            expect(response.body.data).instanceof(Object);
        });
        
        it('Should test survey result', async () => {
            console.log('responseObj::', responseObj);
            const response = await server.get(`${TEST_SURVEY_URL}/${responseObj.id}/result`)
                .set('x-api-key', process.env.API_KEY || 'SurveyAPIKey')
                .expect(OK);
            expect(response).instanceof(Object);
            expect(response.body).instanceof(Object);
            expect(response.body._meta).instanceof(Object);
            expect(response.body._meta).have.property('status_code');
            expect(response.body._meta).have.property('success');
            expect(response.body.data).instanceof(Object);
        });

    });

});

