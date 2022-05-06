import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Server } from 'http';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  const Messengers = {
    id: '1',
    content: 'khanh tien ne',
    timeout: 22,
  };

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
      id: '2',
      content: 'khanh tien',
      timeout: 25,
    };
    return request(server)
      .post('/messenger')
      .send(Messenger)
      .expect(201)
      .expect({
        id: Messenger.id,
        content: Messenger.content,
        timeout: Messenger.timeout,
      });
  });
  it('Timeout must be a Number', function () {
    const time = { timeout: 'akjbfajkdhs' };
    return request(server)
      .post('/messenger')
      .send(time)
      .then((res) => {
        expect(res.body).toMatchObject({
          statuscode: 400,
          message: 'could not create messenger',
          error: 'content is not null and timeout must be a number',
        });
      });
  });
  it('should update messenger', function () {
    const updateMess = [
      {
        id: 1,
        content: 'noi be thoi',
        timeout: 23,
      },
    ];
    return request(server).put('/messenger').send(updateMess).expect(200);
  });

  it('should get a messenger', () => {
    return request(server)
      .get('/messenger/5c56f782-3229-4f49-a087-2dc9b7a32436')
      .expect(200);
  });
  it('return error when get messenger fail', function () {
    return request(server)
      .get('/messenger?id=abdfb')
      .then((res) => {
        expect(res.body).toMatchObject({
          statuscode: 400,
          message: 'could not get messenger',
        });
      });
  });
  it('should delete messenger', function () {
    return request(server).delete('/messenger/1').expect(200);
  });
  // it('should not delete messenger', function () {
  //   return request(server)
  //     .delete('/messenger/dbasjhf')
  //     .then((res) => {
  //       expect(res.body).toMatchObject({
  //         statuscode: 400,
  //         message: 'could not del messenger',
  //       });
  //     });
  // });
});
