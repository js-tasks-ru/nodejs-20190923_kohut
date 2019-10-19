const User = require('../../models/User')

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  }

  let user = await User.findOne({email});
  if (!user) {
    try {
      user = await User.create({
        email,
        displayName,
      });
    } catch (error) {
      return done(error, false, 'something went wrong');
    }
  }

  done(null, user);
};
