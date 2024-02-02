const jwt = require("jsonwebtoken");

const checkAuthToken = (req, res, next) => {
  // 헤더에서 Bearer 토큰을 추출
  const authHeader = req.headers.Authorization;
  const token = authHeader && authHeader.split(" ")[1];
  console.log(authHeader, "authHeader");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Token not provided" });
  }

  // 토큰을 검증
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ error: "Unauthorized - Failed to verify token" });
    }

    // 사용자 정보를 req 객체에 추가
    req.user = decoded;
    next();
  });
};

module.exports = checkAuthToken;
