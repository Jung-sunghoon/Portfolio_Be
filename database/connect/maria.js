const mariadb = require("mariadb");

// MariaDB 연결 풀 설정
const pool = mariadb.createPool({
  host: "localhost",
  user: "jsh",
  password: "wjdtjd1787!",
  database: "portfolio_db",
  connectionLimit: 10, // 연결 풀의 최대 연결 수
  acquireTimeout: 30000, // 연결을 얻어오는데 허용되는 최대 시간 (밀리초)
  allowPublicKeyRetrieval: true, // RSA 공개 키 검색 허용
});

module.exports = pool;
