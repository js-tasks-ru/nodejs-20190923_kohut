const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':

      if (pathname.includes('/')) {
        res.statusCode = 400;
        res.end('not allowed internal path');
      }

      const limitStream = new LimitSizeStream({limit: 104000});
      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});

      req.pipe(limitStream).on('error', (error) => {
        if (error.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end(error.message);
        }
      }).pipe(writeStream).on('error', (error) => {
        if (error.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('file has already exist');
        } else {
          res.statusCode = 500;
          res.end('smth went wrong');
        }
      });

      writeStream.on('close', () => {
        res.statusCode = 201;
        res.end(`${pathname} file was created`);
      })

      req.on('close', () => {
        if (!req.complete) {
          writeStream.destroy();
          fs.unlinkSync(filepath);
        }
      }).on('error', () => {
        res.statusCode = 500;
        res.end('Server error');
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;