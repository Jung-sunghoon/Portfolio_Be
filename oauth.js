const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();

// Passport 설정
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "363973536940-3r7vtsuop9b6jodiulmn3o790bpdm3v1.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // 사용자를 데이터베이스에 저장하거나 기존 사용자를 찾는 로직을 추가할 수 있습니다.
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// 세션 설정
app.use(
  require("express-session")({
    secret: "your-secret-key",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport 초기화 및 세션 지원
app.use(passport.initialize());
app.use(passport.session());

// 라우트 설정
app.get("/", (req, res) => {
  res.send('<a href="/auth/google">구글 로그인</a>');
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.send(
    `<h1>Hello, ${req.user.displayName}!</h1><a href="/logout">로그아웃</a>`
  );
});
