// router.js
const express = require("express");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const blogRouter = require("./routes/apis/blog.controller");
const blogAdminRouter = require("./routes/apis/blogAdmin.controller");
const blogDetailRouter = require("./routes/apis/blogDetails.controller");

const router = express.Router();

router.use("/", indexRouter);
router.use("/users", usersRouter);
router.use("/api/blog", blogRouter);
router.use("/api/blog-admin", blogAdminRouter);
router.use("/api/blog-detail", blogDetailRouter);

module.exports = router;
