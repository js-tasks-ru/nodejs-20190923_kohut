const passport = require('../libs/passport');
const User = require('../models/User');


module.exports.login = async function login(ctx, next) {
  await passport.authenticate('local', async (err, user, info) => {
    if (err) throw err;

    if (!user) {
      ctx.status = 400;
      ctx.body = {error: info};
      return;
    }

    const userBD = await User.findOne({email: user.email});

    if (!userBD) return ctx.throw(400, 'Firstly, You should register');

    if (userBD.verificationToken) {
      return ctx.throw(400, 'Подтвердите email');
    }

    const token = await ctx.login(user);

    ctx.body = {token};
  })(ctx, next);
};
