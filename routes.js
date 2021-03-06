const passport = require("passport");
const path = require("path");
const bcrypt = require("bcrypt");

module.exports = function (app, myDataBase) {
  app.route("/").get((req, res) => {
    res.render(path.join(__dirname, "views/pug"), {
      showSocialAuth: true,
      showRegistration: true,
      showLogin: true,
      title: "Connected to Database",
      message: "Please login",
    });
  });
  app.route("/chat").get(ensureAuthenticated, (req, res, next) => {
    res.render(path.join(__dirname, "views/pug/chat"), { user: req.user });
  });
  app.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/" }),
    (req, res) => {
      res.redirect("/profile");
    }
  );
  app.route("/profile").get(ensureAuthenticated, (req, res) => {
    res.render(path.join(__dirname, "views/pug/profile"), {
      username: req.user.username,
    });
  });
  app.route("/logout").get((req, res) => {
    req.logout();
    res.redirect("/");
  });
  app.route("/register").post(
    (req, res, next) => {
      myDataBase.findOne({ username: req.body.username }, (err, user) => {
        if (err) return next(err);
        if (user) return res.redirect("/");
        const hash = bcrypt.hashSync(req.body.password, 12);
        myDataBase.insertOne(
          {
            username: req.body.username,
            password: hash,
          },
          (err, doc) => {
            if (err) return res.redirect("/");
            return next(null, doc.ops[0]);
          }
        );
      });
    },
    passport.authenticate("local", { failureRedirect: "/" }),
    (req, res, next) => {
      res.redirect("/profile");
    }
  );
  app.route("/auth/github").get(passport.authenticate("github"));
  app
    .route("/auth/github/callback")
    .get(
      passport.authenticate("github", { failureRedirect: "/" }),
      (req, res) => {
        req.session.user_id = req.user.id;
        res.redirect("/chat");
      }
    );
  app.use((req, res, next) => {
    res.status(404).type("text").send("Not Found");
  });
};

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
};
