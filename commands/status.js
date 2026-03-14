const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

module.exports = async ({ sock, msg, send, config }) => {

  try {

    const quoted =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quoted) {
      return send({
        text: `
❌ *STATUS UPDATE FAILED*

⚠️ Please reply to a *Message / Image / Video*
to post it as WhatsApp Status.

📌 *Example:*
Reply to any media and use the command.

🤖 *System:* ${config.botName}
`
      });
    }

    const type = Object.keys(quoted)[0];
    let content = {};

    // IMAGE / VIDEO STATUS
    if (type === "imageMessage" || type === "videoMessage") {

      const stream = await downloadContentFromMessage(
        quoted[type],
        type === "imageMessage" ? "image" : "video"
      );

      let buffer = Buffer.from([]);

      for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
      }

      content = {
        [type === "imageMessage" ? "image" : "video"]: buffer,
        caption: quoted[type].caption || ""
      };

    }

    // TEXT STATUS
    else if (type === "conversation" || type === "extendedTextMessage") {

      content = {
        text: quoted.conversation || quoted.extendedTextMessage.text
      };

    }

    // POST STATUS
    await sock.sendMessage(
      "status@broadcast",
      content,
      { statusJidList: [] }
    );

    await send({
      text: `
✨ *STATUS UPDATED SUCCESSFULLY*

╭━━━〔 *STATUS SYSTEM* 〕━━━⬣
┃ 📢 *Update:* Posted Successfully
┃ 👁️ *Visibility:* Status Broadcast
┃ ⚡ *System:* ${config.botName}
╰━━━━━━━━━━━━━━━━⬣

📣 *OFFICIAL CHANNEL*

🔥 *Join for Bot Updates*

🔗 https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s

${config.footer}
`.trim()
    });

  } catch (err) {

    console.error("Status Command Error:", err);

    await send({
      text: `
🚨 *SYSTEM ERROR*

❌ Failed to update WhatsApp Status.

Please try again later.

🤖 *System:* ${config.botName}
`
    });

  }

};