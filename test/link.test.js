// import test from 'node:test';
// import assert from 'node:assert';
// import request from 'supertest';
// import app from '../src/app.js';


// test('POST /links should create a new link', async () => {
//     const response = await request(app).post('/links').send({ target_url: 'https://example.com' });
//     assert.strictEqual(response.status, 201);
//     assert.strictEqual(response.body.code.length, 16);
//     assert.strictEqual(response.body.target_url, 'https://example.com');
// });

import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../src/app.js';
import { cleanDb } from './setup.js';
import { closeDb } from './setup.js';


test('POST / should create a short link', async () => {

    const response = await request(app)
        .post('/links')
        .send({
            target_url: 'https://google.com'
        });

    assert.strictEqual(response.status, 201);

    assert.ok(response.body.code);
    assert.strictEqual(response.body.target_url, 'https://google.com');
});

test('POST /links should reject invalid target URL', async () => {
    const response = await request(app).post('/links').send({ target_url: 'invalid-url' });
    assert.strictEqual(response.status, 400);
    // assert.strictEqual(response.body.error, 'Invalid target URL');
});

// test('POST /links should create a vanity code', async () => {
//     const response = await request(app).post('/links').send({ target_url: 'https://example.com', code: 'my-code' });
//     assert.strictEqual(response.status, 201);
//     assert.strictEqual(response.body.code, 'my-code');
// });
test('POST /links should create a vanity code', async () => {

    const response = await request(app)
        .post('/links')
        .send({
            target_url: 'https://google.com',
            code: 'google'
        });

    assert.strictEqual(response.status, 201);

    assert.strictEqual(response.body.code, 'google');

});


test('POST /links should reject duplicate vanity code', async () => {
    await request(app).post('/links').send({ target_url: 'https://example.com', code: 'my-code' });
    const response = await request(app).post('/links').send({ target_url: 'https://example.com', code: 'my-code' });
    assert.strictEqual(response.status, 409);
  
});

test.beforeEach(async () => {
    await cleanDb();
});