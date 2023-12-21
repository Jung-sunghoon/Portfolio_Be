// index.js

const express = require("express");
const mariadb = require("mariadb");

const app = express();
const port = 8080;

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

// 루트 엔드포인트
app.get("/BlogPost", (req, res) => {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT * FROM BlogPost")
        .then((results) => {
          res.json(results);
        })
        .catch((err) => {
          console.error("Error querying database:", err);
          res.status(500).json({ error: "Internal Server Error" });
        })
        .finally(() => {
          conn.release();
        });
    })
    .catch((err) => {
      console.error("Error connecting to MariaDB:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get("/CalendarEvent", (req, res) => {
  pool
    .getConnection()
    .then((conn) => {
      conn
        .query("SELECT * FROM CalendarEvent")
        .then((results) => {
          res.json(results);
        })
        .catch((err) => {
          console.error("Error querying database:", err);
          res.status(500).json({ error: "Internal Server Error" });
        })
        .finally(() => {
          conn.release();
        });
    })
    .catch((err) => {
      console.error("Error connecting to MariaDB:", err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
