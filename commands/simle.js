const fs = require("fs");
const path = require("path");

module.exports = async ({ sock, from, msg, config }) => {

  try {

    const stickerPath = path.join(process.cwd(), "simle.webp");

    if (!fs.existsSync(stickerPath)) {
      return sock.sendMessage(
        from,
        { text: "❌ Sticker file not found." },
        { quoted: msg }
      );
    }

    await sock.sendMessage(
      from,
      {
        sticker: fs.readFileSync(stickerPath),

        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,

          externalAdReply: {
            title: "Thelevel8 V1",
            body: "Premium WhatsApp Bot System",
            mediaType: 1,
            sourceUrl:
              "https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s"
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

    console.error("Sticker Command Error:", err);

    await sock.sendMessage(
      from,
      { text: "❌ Error sending sticker." },
      { quoted: msg }
    );

  }

};