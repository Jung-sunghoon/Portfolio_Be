// routes/apis/blog.controller.js
const express = require("express");
const router = express.Router();
const maria = require("../../database/connect/maria");

/**
 * Blog Post Schema
 * @typedef {object} CalendarEvent
 * @property {string} event_id - 이벤트의 ID
 * @property {string} event_title - 이벤트의 제목
 * @property {string} start_time - 시작 시간
 * @property {string} end_time - 종료 시간
 * @property {string} event_text - 이벤트 내용
 * @property {string} event_type - 이벤트 타입
 */

/**
 * @swagger
 * /api/calendar/list:
 *   get:
 *     summary: 이벤트 목록 조회
 *     tags: [Calendar]
 *     responses:
 *       200:
 *         description: 성공적으로 블로그 게시물 목록을 조회함
 *         content:
 *           application/json
 */
router.get("/list", async (req, res) => {
  let conn;
  try {
    // Mariadb 연결
    conn = await maria.getConnection();

    // 블로그 게시물 목록 조회
    const results = await conn.query("SELECT * FROM CalendarEvent");

    const CalendarEvents = results.map((row) => ({
      event_id: Number(row.event_id),
      event_title: row.event_title,
      event_type: row.event_type,
      event_date: row.event_date,
    }));

    res.status(200).json({
      CalendarEvents,
    });
  } catch (error) {
    console.error("Error fetching Calendar Events:", error);
    res.status(500).json({
      message: "이벤트 목록 조회에 실패했습니다.",
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
