const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.encoding = options.encoding;
    this.currentSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this.addDataSize(chunk);
    this.isContinueWriting(chunk, callback);
  }

  addDataSize(chunk) {
    const dataSize = Buffer.byteLength(chunk);
    this.currentSize += dataSize;
  }

  isContinueWriting(chunk, callback) {
    return this.currentSize <= this.limit
      ? this.writeData(chunk, callback)
      : this.showError(callback);
  }

  showError(callback) {
    callback(new LimitExceededError());
  }

  writeData(chunk, callback) {
    const data = this.encoding ? chunk.toString(this.encoding) : chunk.toString();
    callback(null, data);
  }
}

module.exports = LimitSizeStream;
