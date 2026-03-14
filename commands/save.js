const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

module.exports = async ({ sock, msg, send, config }) => {

  try {

    const quoted =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted) {
      return send({
        text: `
❌ *STATUS SAVE FAILED*

⚠️ Please reply to a *Status Image or Video*

📌 *Example:*
Reply to a status and use:
.save

🤖 *System:* ${config.botName}
${config.footer}
`
      });
    }

    let type = null;

    if (quoted.imageMessage) type = "image";
    else if (quoted.videoMessage) type = "video";

    if (!type) {
      return send({
        text: `
❌ *INVALID STATUS TYPE*

Only *Status Images or Videos* can be saved.

🤖 *System:* ${config.botName}
${config.footer}
`
      });
    }

    const stream = await downloadContentFromMessage(
      quoted[type + "Message"],
      type
    );

    let buffer = Buffer.from([]);

    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    const caption = `
✨ *STATUS SAVED SUCCESSFULLY*

╭━━━〔 *STATUS DOWNLOADER* 〕━━━⬣
┃ 📥 *Request:* Status Download
┃ 📁 *Type:* ${type.toUpperCase()}
┃ ⚡ *System:* ${config.botName}
╰━━━━━━━━━━━━━━━━⬣

📢 *Official Channel*
https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s

${config.footer}
`;

    if (type === "image") {
      await send({
        image: buffer,
        caption
      });
    } else {
      await send({
        video: buffer,
        caption
      });
    }

  } catch (error) {

    console.error("Save Status Error:", error);

    await send({
      text: `
🚨 *SYSTEM ERROR*

❌ Failed to download the requested status.

Please try again later.

🤖 *System:* ${config.botName}
`
    });

  }

};