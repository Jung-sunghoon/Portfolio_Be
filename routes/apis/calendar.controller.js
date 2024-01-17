// routes/apis/blog.controller.js
const express = require("express");
const router = express.Router();
const maria = require("../../database/connect/maria");

/**
 * Blog Post Schema
 * @typedef {object} CalendarEvent
 * @property {string} event_id - 이벤트의 ID
 * @property {string} event_title - 이벤트의 제목
 * @property {string} event_date - 이벤트의 날짜
 * @property {string} event_text - 이벤트 내용
 * @property {string} event_type - 이벤트 타입
 */

/**
 * 시작 시간과 종료 시간을 "yyyy-mm-dd" 형식으로 변환
 * @param {string} datetime - ISO 8601 date-time 형식의 문자열
 * @returns {string} - "yyyy-mm-dd" 형식의 문자열
 */
const formatTime = (datetime) => {
  const date = new Date(datetime);
  const formattedDate = date.toISOString().split("T")[0]; // "yyyy-mm-dd"
  return formattedDate;
};

/**
 * @swagger
 * /api/calendar/list:
 *   get:
 *     summary: 이벤트 목록 조회
 *     tags: [Calendar]
 *     responses:
 *       200:
 *         description: 성공적으로 이벤트 목록을 조회함
 *         content:
 *           application/json:
 *             example:
 *               CalendarEvents:
 *                 - event_id: 1
 *                   event_title: "Example Event"
 *                   event_date: "2022-01-01 12:00"
 *                   event_text: "Lorem ipsum dolor sit amet"
 *                   event_type: "중요"
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
      event_date: formatTime(row.event_date),
      event_type: row.event_type,
      event_text: row.event_text,
    }));

    // 클라이언트에게 매번 새로운 데이터를 요청하도록 캐시 관련 헤더 추가
    res.set("Cache-Control", "no-cache, max-age=0");

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
