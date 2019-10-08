const fs = require('fs');

const LimitSizeStream = require('./LimitSizeStream');

module.exports = function postRequest(pathname, filepath, req, res) {
  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('not allowed internal path');
  }

  const limitStream = new LimitSizeStream({limit: 104000});
  const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});

  req.pipe(limitStream).pipe(writeStream);

  limitStream.on('error', (error) => {
    if (error.code === 'LIMIT_EXCEEDED') {
      res.statusCode = 413;
      res.end(error.message);
    }
  });

  writeStream.on('error', (error) => {
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
      fs.unlink(filepath, () => {
        res.statusCode = 500;
        res.end('file isn\'t exist');
      });
    }
  }).on('error', () => {
    res.statusCode = 500;
    res.end('Server error');
  });
};
