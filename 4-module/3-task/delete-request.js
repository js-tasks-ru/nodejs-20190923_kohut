const fs = require('fs');

module.exports = function deleteRequest(pathname, filepath, res) {
  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('internal path is not allowed');
  }

  fs.unlink(filepath, (error) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.statusCode = 404;
        res.end('file isn\'t exist');
      } else {
        res.statusCode = 500;
        res.end('smth went wrong');
      }
    }
    res.statusCode = 200;
    res.end('file was removed');
  });
};
