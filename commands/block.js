module.exports = async ({ sock, from, msg, config, send }) => {

  try {

    // user identify (reply ya mention se)
    const mentionedUser =
      msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    const replyUser =
      msg.message?.extendedTextMessage?.contextInfo?.participant;

    const target =
      mentionedUser || replyUser || (from.endsWith("@s.whatsapp.net") ? from : null);

    if (!target) {
      return await send({
        text: "❗ Error: Please reply to a message or tag a user to block them."
      });
    }

    // user block
    await sock.updateBlockStatus(target, "block");

    await send({
      text: `
*User Blocked Successfully*

The user @${target.split("@")[0]} has been blocked.

${config.footer}
`.trim(),
      mentions: [target]
    });

  } catch (err) {

    console.error("Block Error:", err);

    await send({
      text: "❌ Failed to block the user. Ensure I have the required permissions."
    });

  }

};