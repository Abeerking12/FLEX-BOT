const fs = require("fs");
const path = require("path");

module.exports = async ({ sock, from, msg, config }) => {

  try {

    // Sticker file path
    const stickerPath = path.join(process.cwd(), "kiss.webp");

    // Check if sticker exists
    if (!fs.existsSync(stickerPath)) {
      return;
    }

    // Send sticker
    await sock.sendMessage(
      from,
      {
        sticker: fs.readFileSync(stickerPath),

        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,

          forwardedNewsletterMessageInfo: {
            newsletterJid: config.channelJid,
            newsletterName: config.botName
          }
        }
      },
      { quoted: msg }
    );

  } catch (err) {

    console.error("Kiss Command Error:", err);

  }

};