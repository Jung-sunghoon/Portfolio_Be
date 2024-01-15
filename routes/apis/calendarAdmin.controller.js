const express = require("express");
const router = express.Router();
const maria = require("../../database/connect/maria");
const bodyParser = require("body-parser");

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

//
/**
 * @swagger
 * /api/calendar-admin/create:
 *   post:
 *     summary: 이벤트 생성 또는 수정 (관리자용)
 *     tags: [Calendar Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json
 *     responses:
 *       201:
 *         description: 성공적으로 달력 이벤트를 생성 또는 수정함
 *         content:
 *           application/json
 */

router.post("/create", async (req, res) => {
  const { event_title, start_time, end_time, event_type } = req.body;

  let conn;
  try {
    // Mariadb 연결
    conn = await maria.getConnection();

    if (event_id) {
      // post_id가 주어진 경우, 게시물 수정
      await conn.query(
        "UPDATE CalendarEvent SET event_title = ?, start_time = ?, end_time = ?, event_type = ? WHERE event_id = ?",
        [event_title, start_time, end_time, event_type]
      );

      res.status(200).json({
        message: "이벤트를 성공적으로 수정했습니다.",
        CalendarEvent: {
          event_id,
          event_title,
          start_time,
          end_time,
          event_type,
        },
      });
    } else {
      // event_id가 주어지지 않은 경우, 새로운 게시물 생성
      const result = await conn.query(
        "INSERT INTO CalendarEvent (event_title, start_time, end_time, event_type) VALUES (?, ?, ?, ?)",
        [event_title, start_time, end_time, event_type]
      );

      const newEvent = {
        event_id: Number(result.insertId),
        event_title,
        start_time,
        end_time,
        event_type,
      };

      res.status(201).json({
        message: "이벤트를 성공적으로 생성했습니다.",
        CalendarEvent: newEvent,
      });
    }
  } catch (error) {
    console.error("Error creating or updating Calendar Event:", error);
    res.status(500).json({
      message: "이벤트 생성 또는 수정에 실패했습니다.",
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
 * /api/calendar-admin/delete/{event_id}:
 *   delete:
 *     summary: 이벤트 게시물 삭제 (관리자용)
 *     tags: [Calendar Admin]
 *     parameters:
 *       - in: path
 *         name: event_id
 *         required: true
 *         description: 삭제할 이벤트의 ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 성공적으로 이벤트를 삭제함
 *         content:
 *           application/json
 *       404:
 *         description: 주어진 event_id에 해당하는 이벤트를 찾을 수 없음
 *         content:
 *           application/json
 */

router.delete("/delete/:event_id", async (req, res) => {
  const { event_id } = req.params;

  let conn;
  try {
    // Mariadb 연결
    conn = await maria.getConnection();

    // post_id로 게시물 조회
    const deletedEvent = await conn.query(
      "SELECT * FROM CalendarEvent WHERE event_id = ?",
      [event_id]
    );
    if (!deletedEvent.length) {
      // 주어진 event_id에 해당하는 게시물이 없는 경우
      res.status(404).json({
        message: "주어진 event_id에 해당하는 이벤트를 찾을 수 없습니다.",
      });
      return;
    }

    // 게시물 삭제
    await conn.query("DELETE FROM CalendarEvent WHERE event_id = ?", [
      event_id,
    ]);

    res.status(200).json({
      message: "이벤트를 성공적으로 삭제했습니다.",
      deletedEvent: deletedEvent[0],
    });
  } catch (error) {
    console.error("Error deleting Calendar Event:", error);
    res.status(500).json({
      message: "이벤트 삭제에 실패했습니다.",
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
