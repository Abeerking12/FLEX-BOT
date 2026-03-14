const fs = require("fs");
const path = require("path");

module.exports = async ({ sock, from, msg, config }) => {

  try {

    const stickerPath = path.join(process.cwd(), "nothing.webp");

    // Check if sticker exists
    if (!fs.existsSync(stickerPath)) {

      console.log("❌ nothing.webp sticker not found");

      return await sock.sendMessage(
        from,
        { text: "❌ Sticker file (nothing.webp) not found." },
        { quoted: msg }
      );

    }

    // Read sticker
    const stickerBuffer = fs.readFileSync(stickerPath);

    // Send sticker
    await sock.sendMessage(
      from,
      {
        sticker: stickerBuffer,

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

  } catch (error) {

    console.error("❌ Nothing Command Error:", error);

    await sock.sendMessage(
      from,
      { text: "❌ Failed to send sticker." },
      { quoted: msg }
    );

  }

};