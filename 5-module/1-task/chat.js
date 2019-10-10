class Chat {
  constructor() {
    this.clients = [];
  }

  subscribe(ctx) {
    return new Promise((resolve) => {
      this.clients.push(resolve);

      ctx.res.on('close', () => {
        this.clients.splice(this.clients.indexOf(resolve), 1);
      });
    });
  }

  publish(ctx) {
    const {body: {message}} = ctx.request;
    if (!message) return ctx.body = '';
    if (message.length > 400) return ctx.throw(413, 'message is too long');

    this.clients.forEach((resolve) => {
      resolve(message);
    });

    this.clients = [];
  }
}

module.exports = Chat;
