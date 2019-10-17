const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {
      session: false,
      usernameField: 'email',
    },
    async function(email, password, done) {
      const user = await User.findOne({email});
      if (!user) return done(null, false, 'Нет такого пользователя');
      const isCorrectPassword = await new User(user).checkPassword(password);
      if (!isCorrectPassword) return done(null, false, 'Невереный пароль');

      return done(null, user);
    }
);
