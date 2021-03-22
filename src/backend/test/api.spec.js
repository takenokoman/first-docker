// const app = require('../app');
const request = require('supertest');
const mysql = require('mysql');
const server = require('../bin/server.js').server;
const conn = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'root',
  database: 'docker_db'
});

describe('/api/editテスト', () => {
    beforeAll(() => {
      server.listen(3000);
      conn.connect((err) => {
        if (err) {
          console.log('error connecting: ' + err.stack);
          return;
        }
        console.log('success');
      });
      conn.query(
        'INSERT INTO posts (article) VALUES ("test")'
      )
    });
    it('ステータスコード', async () => {
      const response = await request(server).get('/api/edit');
      expect(response.statusCode).toBe(200);
    });
    afterAll(() => {
      server.close();
    });
});
