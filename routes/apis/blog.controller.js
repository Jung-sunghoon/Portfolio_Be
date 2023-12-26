// routes/apis/blog.controller.js
const express = require("express");
const router = express.Router();
const maria = require("../../database/connect/maria");

/**
 * Blog Post Schema
 * @typedef {object} BlogPost
 * @property {number} post_id - 블로그 게시물의 ID
 * @property {string} title - 블로그 게시물의 제목
 * @property {string} creation_date - 블로그 게시물 작성 날짜
 * @property {number} views - 블로그 게시물 조회수
 */

/**
 * @swagger
 * /api/blog/list:
 *   get:
 *     summary: 블로그 게시물 목록 조회
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: 성공적으로 블로그 게시물 목록을 조회함
 *         content:
 *           application/json:
 *             example:
 *               message: "블로그 게시물 목록을 성공적으로 조회했습니다."
 *               blogPosts:
 *                 - post_id: 1
 *                   title: "첫 번째 게시물"
 *                 - post_id: 2
 *                   title: "두 번째 게시물"
 */
router.get("/list", async (req, res) => {
  let conn;
  try {
    // Mariadb 연결
    conn = await maria.getConnection();

    // 블로그 게시물 목록 조회
    const results = await conn.query("SELECT * FROM BlogPost");

    const blogPosts = results.map((row) => ({
      post_id: Number(row.post_id),
      title: row.title,
      views: Number(row.views),
      creation_date: row.creation_date,
    }));

    res.status(200).json({
      message: "블로그 게시물 목록을 성공적으로 조회했습니다.",
      blogPosts,
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).json({
      message: "블로그 게시물 목록 조회에 실패했습니다.",
      error: error.toString(),
    });
  } finally {
    if (conn) {
      // Mariadb 연결 해제
      conn.release();
    }
  }
});

module.exports = router;
