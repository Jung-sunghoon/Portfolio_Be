// routes/apis/blogDetails.controller.js
const express = require("express");
const router = express.Router();
const maria = require("../../database/connect/maria");

/**
 * Blog Post Schema
 * @typedef {object} BlogPost
 * @property {number} post_id - 블로그 게시물의 ID
 * @property {string} title - 블로그 게시물의 제목
 * @property {string} content - 블로그 게시물의 내용
 * @property {string} creation_date - 블로그 게시물 작성 날짜
 * @property {number} views - 블로그 게시물 조회수
 */

/**
 * @swagger
 * /api/blog-detail/{post_id}:
 *   get:
 *     summary: 블로그 게시물 디테일 페이지
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         description: 조회할 블로그 게시물의 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 성공적으로 블로그 게시물 디테일 페이지 가져오기
 *         content:
 *           application/json:
 *             example:
 *               message: "블로그 게시물 디테일 페이지를 성공적으로 가져왔습니다."
 *               blogPostDetail:
 *                 post_id: 1
 *                 title: "첫 번째 게시물"
 *                 content: "이것은 첫 번째 게시물입니다."
 *                 creation_date: "2023-12-12"
 *                 views: 0
 *       404:
 *         description: 주어진 post_id에 해당하는 게시물을 찾을 수 없음
 *         content:
 *           application/json:
 *             example:
 *               message: "주어진 post_id에 해당하는 게시물을 찾을 수 없습니다."
 */
router.get("/:post_id", async (req, res) => {
  const { post_id } = req.params;

  let conn;
  try {
    // Mariadb 연결
    conn = await maria.getConnection();

    // 블로그 게시물 디테일 조회
    const result = await conn.query(
      "SELECT * FROM BlogPost WHERE post_id = ?",
      [post_id]
    );

    if (result.length === 0) {
      // 해당 post_id에 해당하는 게시물이 없는 경우
      res.status(404).json({
        message: "주어진 post_id에 해당하는 게시물을 찾을 수 없습니다.",
      });
    } else {
      // 해당 post_id에 해당하는 게시물이 있는 경우
      const blogPostDetail = {
        post_id: Number(result[0].post_id),
        title: result[0].title,
        content: result[0].content,
        views: Number(result[0].views),
        creation_date: result[0].creation_date,
      };

      res.status(200).json({
        message: "블로그 게시물 디테일 페이지를 성공적으로 가져왔습니다.",
        blogPostDetail,
      });
    }
  } catch (error) {
    console.error("Error fetching blog post detail:", error);
    res.status(500).json({
      message: "블로그 게시물 디테일 페이지 조회에 실패했습니다.",
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
