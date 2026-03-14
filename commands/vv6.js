const { downloadMediaMessage } = require("@whiskeysockets/baileys");

module.exports = async ({ sock, from, msg, config, send }) => {

  try {

    // check reply
    const context = msg.message?.extendedTextMessage?.contextInfo;
    const quoted = context?.quotedMessage;

    if (!quoted) {
      return send({
        text: "❗ Reply to a *view-once image or video* to reveal it."
      });
    }

    // detect view once message
    let viewOnceContent;

    if (quoted.viewOnceMessageV2?.message) {
      viewOnceContent = quoted.viewOnceMessageV2.message;
    } 
    else if (quoted.viewOnceMessage?.message) {
      viewOnceContent = quoted.viewOnceMessage.message;
    }

    if (!viewOnceContent) {
      return send({
        text: "❌ This message is not a *view-once media*."
      });
    }

    // detect media type
    const isImage = !!viewOnceContent.imageMessage;
    const isVideo = !!viewOnceContent.videoMessage;

    if (!isImage && !isVideo) {
      return send({
        text: "⚠️ Unsupported media type."
      });
    }

    // download media
    const buffer = await downloadMediaMessage(
      { message: viewOnceContent },
      "buffer",
      {},
      { logger: console }
    );

    if (!buffer) {
      return send({
        text: "❌ Failed to download media."
      });
    }

    const sender = msg.key.participant || msg.key.remoteJid;

    const caption = `
🛰️ *${config.botName}*

🔓 *View-Once Media Revealed*

👤 From: @${sender.split("@")[0]}
📥 Delivered privately

${config.footer}
`.trim();

    // send privately
    await sock.sendMessage(
      sender,
      {
        [isVideo ? "video" : "image"]: buffer,
        caption,
        mentions: [sender],
        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,
          forwardedNewsletterMessageInfo: {
            newsletterJid: config.channelJid,
            newsletterName: config.botName
          }
        }
      }
    );

    // group confirmation
    await sock.sendMessage(
      from,
      {
        text: "✅ View-once media sent to your private chat."
      },
      { quoted: msg }
    );

  } catch (err) {

    console.error("Reveal Error:", err);

    await send({
      text: "❌ Error revealing media. Try again."
    });

  }

};