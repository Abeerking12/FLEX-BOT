const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = async ({ sock, from, msg, config, send }) => {

  try {

    const quoted =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted) {
      return send({
        text: "⚠️ Please reply to an *image* with `.setdp` to update bot profile picture."
      });
    }

    if (!quoted.imageMessage) {
      return send({
        text: "❌ Invalid media. Reply to an *image* only."
      });
    }

    await send({
      text: "🔄 Updating profile picture... ⏳"
    });

    const buffer = await downloadMediaMessage(
      { message: quoted },
      "buffer",
      {}
    );

    await sock.updateProfilePicture(sock.user.id, buffer);

    const imageUrl =
      "https://i.ibb.co/fdKj27l/b72b78705e3680ac66006770a3f9.jpg";

    const caption = `
✅ *DP UPDATED SUCCESSFULLY*

🤖 *Bot:* ${config.botName}

Your new profile picture has been applied.

> ༒ FLEX ZONE SYSTEM ༒
`;

    await sock.sendMessage(
      from,
      {
        image: { url: imageUrl },
        caption,

        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,

          externalAdReply: {
            title: config.botName,
            body: "FLEX ZONE SYSTEM",
            thumbnailUrl: imageUrl,
            sourceUrl:
              "https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s",
            mediaType: 1,
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

    console.error("SETDP ERROR:", error);

    await send({
      text: "❌ Failed to update profile picture."
    });

  }

};