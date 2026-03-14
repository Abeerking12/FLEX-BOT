const fs = require("fs");
const path = require("path");

module.exports = async ({ sock, from, msg, config }) => {

  try {

    const stickerPath = path.join(process.cwd(), "stickers", "shake.webp");

    if (!fs.existsSync(stickerPath)) {
      return await sock.sendMessage(
        from,
        {
          text: `
❌ *STICKER NOT FOUND*

⚠️ Required file:
📁 stickers/shake.webp

Please add the sticker file to continue.

🤖 *System:* ${config.botName}
`
        },
        { quoted: msg }
      );
    }

    const stickerBuffer = fs.readFileSync(stickerPath);

    await sock.sendMessage(
      from,
      {
        sticker: stickerBuffer,

        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,

          externalAdReply: {
            title: "✨ FLEX ZONE V1",
            body: "Premium WhatsApp Bot System",
            mediaType: 1,
            thumbnailUrl: config.imageUrl,
            sourceUrl:
              "https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s",
            renderLargerThumbnail: true
          },

          forwardedNewsletterMessageInfo: {
            newsletterJid: config.channelJid,
            newsletterName: config.botName
          }
        }
      },
      { quoted: msg }
    );

  } catch (error) {

    console.error("Shake Sticker Error:", error);

    await sock.sendMessage(
      from,
      {
        text: `
🚨 *SYSTEM ERROR*

❌ Failed to send *Shake Sticker*

📌 Please try again later.

🤖 *System:* ${config.botName}
`
      },
      { quoted: msg }
    );

  }

};