const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const bodyParser = require("body-parser");
const router = require("./router");
const session = require("express-session");
const passport = require("./oauth"); // oauth.js 파일을 불러옴

require("dotenv").config();

const app = express();

// mariaDB connect
const maria = require("./database/connect/maria");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Swagger JSDoc 설정
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Portfolio API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3000", // 요청 URL
      },
    ],
  },
  apis: ["./routes/apis/*.controller.js"], // Swagger 문서 파일 경로
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Swagger UI 설정
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 라우터 설정
app.use(router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // send JSON response for API requests
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      stack: req.app.get("env") === "development" ? err.stack : undefined,
    },
  });
});

module.exports = app;
