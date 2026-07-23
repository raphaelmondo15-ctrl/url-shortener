import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import app from '../src/app.js';
import { cleanDb, closeDb } from './setup.js';


test.beforeEach(async () => {
    await cleanDb();
});


test('GET /links/:code/clicks should return click logs', async () => {

    // Create a link
    const createResponse = await request(app)
        .post('/links')
        .send({
            target_url: 'https://google.com'
        });


    const code = createResponse.body.code;


    // Trigger redirect twice
    await request(app)
        .get(`/${code}`)
        .redirects(0);

    await request(app)
        .get(`/${code}`)
        .redirects(0);


    // Get clicks
    const response = await request(app)
        .get(`/links/${code}/clicks`);


    assert.strictEqual(response.status, 200);

    assert.ok(Array.isArray(response.body));

    assert.strictEqual(response.body.length, 2);

});


test('GET /links/:code/clicks.csv should export CSV', async () => {

    const createResponse = await request(app)
        .post('/links')
        .send({
            target_url: 'https://google.com'
        });


    const code = createResponse.body.code;


    await request(app)
        .get(`/${code}`)
        .redirects(0);


    const response = await request(app)
        .get(`/links/${code}/clicks.csv`);


    assert.strictEqual(response.status, 200);


    assert.match(
        response.headers['content-type'],
        /text\/csv/
    );


    assert.match(
        response.text,
        /clicked_at,referrer,user_agent/
    );

});


test.after(async () => {
    await closeDb();
});