const fs = require('fs');

module.exports = function getRequest(filepath, pathname, res) {
  function requestCallback(err, data) {
    if (pathname.includes('/')) {
      res.statusCode = 400;
      res.end('access to this path is forbidden');
    } else if (err) {
      res.statusCode = 404;
      res.end('file doesn\'t exist');
    } else if (data.isDirectory()) {
      res.statusCode = 500;
      res.end('path is incorrect');
    } else {
      const readableStream = fs.createReadStream(filepath);
      readableStream.pipe(res);
    }
  }

  fs.stat(filepath, requestCallback);
};
