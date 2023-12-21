const router = require("express").Router();
const blog = require("./blog");

/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: 블로그 게시물 추가 수정 삭제 조회
 */
router.use("/blog", blog);

module.exports = router;
