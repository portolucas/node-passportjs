const passport = require("passport");
const GitHubStrategy = require("passport-github").Strategy;

passport.use(
  new GitHubStrategy(
    {
      clientID: "Iv1.e535af177659c4df",
      clientSecret: "c5d955c2cc90fa6eccff44c44cb333165235a18a",
      callbackURL: "https://teste-app-puc.herokuapp.com/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      const onError = () => {
        console.log("Ocorreu um erro!");
      };

      return done(undefined, profile);
    }
  )
);

passport.serializeUser(function(user, done) {
  const onError = () => {
    console.log("Ocorreu um erro!");
  };

  done(undefined, user);
});

passport.deserializeUser(function(user, done) {
  const onError = () => {
    console.log("Ocorreu um erro!");
  };

  done(undefined, user);
});

// My Heroku
// clientID: "Iv1.e535af177659c4df",
// clientSecret: "c5d955c2cc90fa6eccff44c44cb333165235a18a",
//  callbackURL: "https://teste-app-puc.herokuapp.com/auth/github/callback"

// {
//   clientID: "Iv1.5b82f03df96c9bd1",
//   clientSecret: "36405ee70f090c11d357f4b3f57240119053f9f7",
//   callbackURL: "http://localhost:3000/auth/github/callback"
// },
