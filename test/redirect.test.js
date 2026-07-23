import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import app from '../src/app.js';
import pool from '../src/config/db.js';
import { cleanDb, closeDb } from './setup.js';


test.beforeEach(async () => {
    await cleanDb();
});


test('GET /:code should redirect to the original URL', async () => {

    const createResponse = await request(app)
        .post('/links')
        .send({
            target_url: 'https://google.com'
        });


    const code = createResponse.body.code;


    const response = await request(app)
        .get(`/${code}`)
        .redirects(0);


    assert.strictEqual(response.status, 302);

    assert.strictEqual(
        response.headers.location,
        'https://google.com'
    );
});


test('GET /:code should return 404 when link does not exist', async () => {

    const response = await request(app)
        .get('/unknown123');


    assert.strictEqual(response.status, 404);

});


test('GET /:code should return 410 when link expired', async () => {

    const createResponse = await request(app)
        .post('/links')
        .send({
            target_url: 'https://google.com',
            expires_at: '2020-01-01T00:00:00.000Z'
        });


    const code = createResponse.body.code;


    const response = await request(app)
        .get(`/${code}`);


    assert.strictEqual(response.status, 410);

});


test('redirect should increase click count', async () => {

    const createResponse = await request(app)
        .post('/links')
        .send({
            target_url: 'https://google.com'
        });


    const code = createResponse.body.code;


    await request(app)
        .get(`/${code}`)
        .redirects(0);


    const result = await pool.query(
        'SELECT click_count FROM links WHERE code = $1',
        [code]
    );


    assert.strictEqual(
        result.rows[0].click_count,
        1
    );

});


test.after(async () => {
    await closeDb();
});