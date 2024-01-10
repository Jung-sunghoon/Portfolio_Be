const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const bodyParser = require("body-parser");

const router = express.Router();
const googleClientId = process.env.GOOGLE_CLIENT_ID; // 구글 개발자 콘솔에서 발급한 클라이언트 ID

const client = new OAuth2Client(googleClientId);

router.use(bodyParser.json());

/**
 * @swagger
 * /api/google-login-info:
 *   post:
 *     summary: Get Google OAuth Information
 *     description: Endpoint to get Google OAuth information from the client
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               credentialResponse:
 *                 type: string
 *             required:
 *               - credentialResponse
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Data received successfully
 */

router.post("/verify-google-id-token", async (req, res) => {
  const credentialResponse = req.body.credentialResponse;
  try {
    // Google ID Token 추출
    const idToken = credentialResponse;
    console.log("hello", credentialResponse);

    // Google ID Token 검증
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: googleClientId,
    });

    // Google ID Token 검증 성공
    const payload = ticket.getPayload();
    console.log("Google ID Token verified successfully:", payload);

    // 여기에서 payload를 기반으로 사용자 정보를 처리할 수 있습니다.
    res.status(200).json({ message: "Google ID Token verified successfully" });
  } catch (error) {
    // Google ID Token 검증 실패
    console.error("Error verifying Google ID Token:", error.message);
    res.status(500).json({ error: "Failed to verify Google ID Token" });
  }
});

module.exports = router;
