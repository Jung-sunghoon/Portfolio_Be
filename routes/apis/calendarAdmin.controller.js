const express = require("express");
const router = express.Router();
const maria = require("../../database/connect/maria");
const bodyParser = require("body-parser");
const dayjs = require("dayjs");
const checkAuthToken = require("../../swaggerSec");

/**
 * Blog Post Schema
 * @typedef {object} CalendarEvent
 * @property {string} event_id - 이벤트의 ID
 * @property {string} event_title - 이벤트의 제목
 * @property {string} event_date - 이벤트 날짜
 * @property {string} event_text - 이벤트 내용
 * @property {string} event_type - 이벤트 타입
 */

/**
 * 시작 시간과 종료 시간을 "yyyy-mm-dd" 형식으로 변환
 * @param {string} datetime - ISO 8601 date-time 형식의 문자열
 * @returns {string} - "yyyy-mm-dd" 형식의 문자열
 */
const formatTime = (datetime) => {
  const date = new dayjs(datetime);
  const formattedDate = date.format("YYYY-MM-DD"); // "yyyy-mm-dd"
  return formattedDate;
};

/**
 * @swagger
 * components:
 *   schemas:
 *     CalendarEvent:
 *       type: object
 *       properties:
 *         event_id:
 *           type: number
 *           description: 이벤트의 ID
 *         event_title:
 *           type: string
 *           description: 이벤트의 제목
 *         event_date:
 *           type: string
 *           description: 이벤트 날짜 (yyyy-mm-dd 00:00 형식)
 *         event_text:
 *           type: string
 *           description: 이벤트 내용
 *         event_type:
 *           type: string
 *           description: 이벤트 타입
 */

/**
 * @swagger
 * /api/calendar-admin/create:
 *   post:
 *     summary: 이벤트 생성 또는 수정 (관리자용)
 *     tags: [Calendar Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_id
 *               - event_title
 *               - event_date
 *               - event_type
 *               - event_text
 *             properties:
 *               event_id:
 *                 type: number
 *                 description: 이벤트의 ID
 *               event_title:
 *                 type: string
 *                 description: 이벤트의 제목
 *               event_date:
 *                 type: string
 *                 format: date-time
 *                 description: 이벤트 날짜 (ISO 8601 date-time 형식)
 *               event_type:
 *                 type: string
 *                 description: 이벤트 타입
 *               event_text:
 *                 type: string
 *                 description: 이벤트 내용
 *     responses:
 *       201:
 *         description: 성공적으로 달력 이벤트를 생성 또는 수정함
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 응답 메시지
 *                 CalendarEvent:
 *                   $ref: '#/components/schemas/CalendarEvent'
 *       400:
 *         description: 잘못된 요청 형식
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 에러 메시지
 *       500:
 *         description: 서버 에러
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 에러 메시지
 */

router.post("/create", checkAuthToken, async (req, res) => {
  const { event_id, event_title, event_date, event_type, event_text } =
    req.body;

  let conn;
  try {
    // Mariadb 연결
    conn = await maria.getConnection();

    if (event_id) {
      // event_id가 주어진 경우, 게시물 수정
      await conn.query(
        "UPDATE CalendarEvent SET event_title = ?, event_date = ?, event_type = ?, event_text = ? WHERE event_id = ?",
        [event_title, formatTime(event_date), event_type, event_text, event_id]
      );

      res.status(200).json({
        message: "이벤트를 성공적으로 수정했습니다.",
        CalendarEvent: {
          event_id,
          event_title,
          event_date: formatTime(event_date),
          event_type,
          event_text,
        },
      });
    } else {
      // event_id가 주어지지 않은 경우, 새로운 게시물 생성
      const result = await conn.query(
        "INSERT INTO CalendarEvent (event_title, event_date, event_type, event_text) VALUES (?, ?, ?, ?)",
        [event_title, formatTime(event_date), event_type, event_text]
      );

      const newEvent = {
        event_title,
        event_date: formatTime(event_date),
        event_type,
        event_text,
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
 *           application/json:
 *              example:
 *               이벤트가 삭제되었습니다.
 *       404:
 *         description: 주어진 event_id에 해당하는 이벤트를 찾을 수 없음
 *         content:
 *           application/json:
 *            example:
 *               이벤트를 찾을 수 없습니다.
 */

router.delete("/delete/:event_id", checkAuthToken, async (req, res) => {
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

/**
 * @swagger
 * /api/calendar-admin/update:
 *   put:
 *     summary: 이벤트 업데이트
 *     description: 지정된 세부 정보로 기존 이벤트를 업데이트합니다.
 *     tags: [Calendar Admin]
 *     requestBody:
 *       description: 업데이트할 이벤트 세부 정보
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_id:
 *                 type: number
 *                 description: 업데이트할 이벤트의 ID.
 *               event_title:
 *                 type: string
 *                 description: 업데이트된 이벤트의 제목.
 *               event_date:
 *                 type: string
 *                 format: date
 *                 description: 업데이트된 이벤트의 날짜 (YYYY-MM-DD).
 *               event_type:
 *                 type: string
 *                 description: 업데이트된 이벤트의 유형.
 *               event_text:
 *                 type: string
 *                 description: 업데이트된 이벤트의 텍스트/설명.
 *             required:
 *               - event_id
 *               - event_title
 *               - event_date
 *               - event_type
 *               - event_text
 *     responses:
 *       '200':
 *         description: 이벤트 업데이트 성공.
 *         content:
 *           application/json:
 *             example:
 *               message: 이벤트가 성공적으로 업데이트되었습니다.
 *       '400':
 *         description: 잘못된 요청. 누락된 또는 잘못된 매개변수.
 *         content:
 *           application/json:
 *             example:
 *               message: 잘못된 요청. 누락된 또는 잘못된 매개변수.
 *       '404':
 *         description: 이벤트를 찾을 수 없음.
 *         content:
 *           application/json:
 *             example:
 *               message: 이벤트를 찾을 수 없습니다.
 */

router.put("/update/:event_id", checkAuthToken, async (req, res) => {
  const { event_id, event_title, event_date, event_type, event_text } =
    req.body;

  let conn;
  try {
    // Mariadb 연결
    conn = await maria.getConnection();

    // event_id가 주어진 경우, 게시물 수정
    await conn.query(
      "UPDATE CalendarEvent SET event_title = ?, event_date = ?, event_type = ?, event_text = ? WHERE event_id = ?",
      [event_title, formatTime(event_date), event_type, event_text, event_id]
    );

    res.status(200).json({
      message: "이벤트를 성공적으로 수정했습니다.",
      CalendarEvent: {
        event_id,
        event_title,
        event_date: formatTime(event_date),
        event_type,
        event_text,
      },
    });
  } catch (error) {
    console.error("Error updating Calendar Event:", error);
    res.status(500).json({
      message: "이벤트 수정에 실패했습니다.",
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
