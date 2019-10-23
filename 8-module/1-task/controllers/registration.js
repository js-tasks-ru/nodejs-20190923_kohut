const User = require('../models/User');
const sendMail = require('../libs/sendMail');
const token = require('../libs/createToken');

module.exports.register = async (ctx, next) => {
  const {email, displayName, password} = ctx.request.body;

  if (!email) ctx.throw(400, `{email: 'Ваш email обязателен'}`);
  if (!password) ctx.throw(400, `{email: 'Ваш password обязателен'}`);
  if (!displayName) ctx.throw(400, `{email: 'Ваш displayName обязателен'}`);

  let user = await User.findOne({email});
  if (user) {
    ctx.status = 400;
    return ctx.body = {
      errors: {
        email: 'Такой email уже существует',
      },
    };
  }
  try {
    const verificationToken = token();
    user = new User({
      email,
      displayName,
      verificationToken,
    });
    await user.setPassword(password);
    await user.save();

    await sendMail({
      to: email,
      subject: 'Подтверждение регистрации',
      locals: {token: verificationToken},
      template: 'confirmation',
    });

    ctx.body = {status: 'ok'};
  } catch (e) {
    ctx.throw(500, `{ errors: { error: 'Somethig went wrong' } }`);
  }
};

module.exports.confirm = async (ctx, next) => {
  const {verificationToken} = ctx.request.body;
  const user = await User.findOne({verificationToken});
  if (!user) return ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
  user.verificationToken = undefined;
  await user.save();
  return ctx.body = {token: verificationToken};
};
