const express = require("express");
const router = express.Router();
const maria = require("../../database/connect/maria");
const bodyParser = require("body-parser");

/**
 * Blog Post Schema
 * @typedef {object} BlogPost
 * @property {string} title - 블로그 게시물의 제목
 * @property {string} content - 블로그 게시물의 내용
 * @property {any} thumbnail - 블로그 게시물 썸네일
 */

/**
 * @swagger
 * /api/blog-admin/create:
 *   post:
 *     summary: 블로그 게시물 생성 또는 수정 (관리자용)
 *     tags: [Blog Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             title: "새로운 게시물"
 *             content: "이것은 새로운 게시물입니다."
 *             post_id: 3
 *             thumbnail: "썸네일"
 *     responses:
 *       201:
 *         description: 성공적으로 블로그 게시물을 생성 또는 수정함
 *         content:
 *           application/json:
 *             example:
 *               blogPost: { post_id: 3, title: "새로운 게시물", content: "이것은 새로운 게시물입니다." ,thumbnail: "썸네일" }
 */

router.post("/create", async (req, res) => {
  const { title, content, post_id, thumbnail } = req.body;

  let conn;
  try {
    // Mariadb 연결
    conn = await maria.getConnection();

    if (post_id) {
      // post_id가 주어진 경우, 게시물 수정
      await conn.query(
        "UPDATE BlogPost SET title = ?, content = ? , thumbnail = ? WHERE post_id = ?",
        [title, content, thumbnail, post_id]
      );

      res.status(200).json({
        message: "블로그 게시물을 성공적으로 수정했습니다.",
        blogPost: { post_id, title, content, thumbnail },
      });
    } else {
      // post_id가 주어지지 않은 경우, 새로운 게시물 생성
      const result = await conn.query(
        "INSERT INTO BlogPost (title, content, thumbnail) VALUES (?, ?, ?)",
        [title, content, thumbnail]
      );

      const newPost = {
        post_id: Number(result.insertId),
        title,
        content,
        thumbnail,
      };

      res.status(201).json({
        message: "블로그 게시물을 성공적으로 생성했습니다.",
        blogPost: newPost,
      });
      console.log(newPost, "newPost");
    }
  } catch (error) {
    console.error("Error creating or updating blog post:", error);
    res.status(500).json({
      message: "블로그 게시물 생성 또는 수정에 실패했습니다.",
      error: error.toString(),
    });
  } finally {
    if (conn) {
      // Mariadb 연결 해제
      conn.release();
    }
  }
});

//게시물 삭제 API

/**
 * @swagger
 * /api/blog-admin/delete/{post_id}:
 *   delete:
 *     summary: 블로그 게시물 삭제 (관리자용)
 *     tags: [Blog Admin]
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         description: 삭제할 블로그 게시물의 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 성공적으로 블로그 게시물을 삭제함
 *         content:
 *           application/json:
 *             example:
 *               deletedPost: { post_id: 3, title: "삭제된 게시물", content: "이것은 삭제된 게시물입니다.", thumbnail: "썸네일" }
 *       404:
 *         description: 주어진 post_id에 해당하는 게시물을 찾을 수 없음
 *         content:
 *           application/json:
 *             example:
 *               message: "주어진 post_id에 해당하는 게시물을 찾을 수 없습니다."
 */

router.delete("/delete/:post_id", async (req, res) => {
  const { post_id } = req.params;

  let conn;
  try {
    // Mariadb 연결
    conn = await maria.getConnection();

    // post_id로 게시물 조회
    const deletedPost = await conn.query(
      "SELECT * FROM BlogPost WHERE post_id = ?",
      [post_id]
    );
    if (!deletedPost.length) {
      // 주어진 post_id에 해당하는 게시물이 없는 경우
      res.status(404).json({
        message: "주어진 post_id에 해당하는 게시물을 찾을 수 없습니다.",
      });
      return;
    }

    // 게시물 삭제
    await conn.query("DELETE FROM BlogPost WHERE post_id = ?", [post_id]);

    res.status(200).json({
      message: "블로그 게시물을 성공적으로 삭제했습니다.",
      deletedPost: deletedPost[0],
    });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    res.status(500).json({
      message: "블로그 게시물 삭제에 실패했습니다.",
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
