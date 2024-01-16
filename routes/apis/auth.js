const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const maria = require("../../database/connect/maria");

const router = express.Router();
const googleClientId = process.env.GOOGLE_CLIENT_ID; // 구글 개발자 콘솔에서 발급한 클라이언트 ID

const client = new OAuth2Client(googleClientId);

router.use(bodyParser.json());

// express-session 미들웨어 설정
router.use(
  session({
    secret: process.env.SESSION_SECRET, // 세션 암호화에 사용되는 비밀 키
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false, // true로 설정하면 HTTPS에서만 동작
      maxAge: 1000 * 60 * 60 * 24, // 쿠키의 유효 시간 설정 (24시간)
    },
  })
);

router.post("/verify-google-id-token", async (req, res) => {
  const credentialResponse = req.body.credentialResponse;
  try {
    // Google ID Token 추출
    const idToken = credentialResponse;

    // Google ID Token 검증
    const token = await client.verifyIdToken({
      idToken: idToken,
      audience: googleClientId,
    });

    // Google ID Token 검증 성공
    const payload = token.getPayload();

    const userEmailFromGoogle = payload.email;
    const userFromDB = await getUserFromDBByEmail(userEmailFromGoogle);

    if (userFromDB) {
      const userToken = jwt.sign(
        { email: userEmailFromGoogle },
        process.env.SESSION_SECRET
      );

      // 세션에 토큰 저장
      req.session.token = userToken;

      res
        .status(200)
        .json({ message: "User exists in the database", token: userToken });
    } else {
      res.status(200).json({ message: "User does not exist in the database" });
    }
  } catch (error) {
    // Google ID Token 검증 실패
    res.status(500).json({ error: "Failed to verify Google ID Token" });
  }
});

async function getUserFromDBByEmail(email) {
  let conn;
  try {
    conn = await maria.getConnection();
    const [rows, Fields] = await conn.query(
      "SELECT * From User WHERE email = ?",
      [email]
    );
    return rows;
  } finally {
    if (conn) {
      conn.release();
    }
  }
}

module.exports = router;
