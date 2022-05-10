import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Server } from 'http';
import { MessengerModule } from '../src/messenger/messenger.module';
import { AppModule } from '../src/app.module';
import { randomUUID } from 'crypto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MessengerModule, AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  it('Post messenger', function () {
    const Messenger = {
      id: randomUUID(),
      content: 'khanh tien',
      timeout: 25,
    };

    return request(server)
      .post(`/messenger/`)
      .send(Messenger)
      .expect(201)
      .expect({
        id: Messenger.id,
        content: Messenger.content,
        timeout: Messenger.timeout,
      });
  });

  it('Timeout must be a Number', function () {
    const userId = '5f28025a-cac8-40d5-87d4-63e2ab84851a';
    const time = { timeout: 'invalid timeout' };

    return request(server)
      .put(`/messenger/${userId}`)
      .send(time)
      .expect(404)
      .expect({
        statusCode: 404,
        message: `Cannot PUT /messenger/${userId}`,
        error: 'Not Found',
      });
  });

  it('should update messenger', function () {
    const updateMess = [
      {
        id: '49ab9d17-5f0b-423d-85fb-77c715bb9d2b',
        content: 'noi be thoi',
        timeout: 23,
      },
    ];

    return request(server).put('/messenger').send(updateMess).expect(200);
  });

  it('should get a messenger', () => {
    const messID = '49ab9d17-5f0b-423d-85fb-77c715bb9d2b';

    return request(server).get(`/messenger/${messID}`).expect(200);
  });

  it('return error when get messenger fail', function () {
    return request(server).get('/messenger?id=abdfb').expect(404).expect({
      statusCode: 404,
      message: 'Cannot GET /messenger?id=abdfb',
      error: 'Not Found',
    });
  });

  it('could delete messenger', function () {
    const messID = '3ce114d4-ec8e-4192-8f64-a5e1789b6032';

    return request(server).delete(`/messenger/${messID}`).expect(200);
  });

  it('could not delete messenger', function () {
    return request(server).delete('/messenger/dbasjhf').expect({});
  });

  afterAll(async () => {
    await app.close();
  });
});
