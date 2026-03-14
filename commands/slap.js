const fs = require("fs");
const path = require("path");

module.exports = async ({ sock, from, msg, config }) => {

  try {

    const stickerPath = path.join(process.cwd(), "slap.webp");

    if (!fs.existsSync(stickerPath)) {
      return await sock.sendMessage(
        from,
        {
          text: `
❌ *STICKER FILE NOT FOUND*

⚠️ Required file:
📁 slap.webp

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
            title: "💥 SLAP ACTION",
            body: "FLEX V1 • Premium Bot System",
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

  } catch (err) {

    console.error("Slap Sticker Error:", err);

    await sock.sendMessage(
      from,
      {
        text: `
🚨 *SYSTEM ERROR*

❌ Failed to send *Slap Sticker*

Please try again later.

🤖 *System:* ${config.botName}
`
      },
      { quoted: msg }
    );

  }

};