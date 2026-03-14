const fs = require("fs");
const path = require("path");

module.exports = async ({ sock, from, msg, config }) => {

  // sticker file ka path
  const stickerPath = path.join(process.cwd(), "danger.webp");

  // agar file exist karti hai
  if (fs.existsSync(stickerPath)) {

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

  }

};