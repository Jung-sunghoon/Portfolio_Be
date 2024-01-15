// router.js
const express = require("express");
const router = express.Router();

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const blogRouter = require("./routes/apis/blog.controller");
const blogAdminRouter = require("./routes/apis/blogAdmin.controller");
const blogDetailRouter = require("./routes/apis/blogDetails.controller");
const authRouter = require("./routes/apis/auth");
const calendarRouter = require("./routes/apis/calendar.controller");
const calendarAdminRouter = require("./routes/apis/calendarAdmin.controller");

router.use("/", indexRouter);
router.use("/users", usersRouter);
router.use("/api/blog", blogRouter);
router.use("/api/blog-admin", blogAdminRouter);
router.use("/api/blog-detail", blogDetailRouter);
router.use("/api/auth", authRouter);
router.use("/api/calendar", calendarRouter);
router.use("/api/calendar-admin", calendarAdminRouter);

module.exports = router;
