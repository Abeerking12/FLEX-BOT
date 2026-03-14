module.exports = async ({ sock, from, msg, send, body, config }) => {

  try {

    // 📌 Group check
    if (!from.endsWith("@g.us")) {
      return send({
        text: "❌ *GROUP ONLY COMMAND*\n\n📌 This command can only be used inside a group."
      });
    }

    // 📝 Description text
    const desc = body.split(" ").slice(1).join(" ");

    if (!desc) {
      return send({
        text: `
⚠️ *DESCRIPTION REQUIRED*

📝 Please provide a new group description.

📖 *Example:*
.setdesc Welcome to our official group flex zone

${config?.footer || ""}
`
      });
    }

    // 🔄 Update group description
    await sock.groupUpdateDescription(from, desc);

    const message = `
✨ *GROUP DESCRIPTION UPDATED*

╭━━━〔 *GROUP SETTINGS* 〕━━━⬣
┃ 📝 *New Description:*
┃ ${desc}
┃
┃ 🤖 *System:* FLEX ZONE
┃ ⚡ *Status:* Successfully Updated
╰━━━━━━━━━━━━━━━━⬣

📢 *Stay Connected With Us*
🔗 https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s

${config?.footer || ""}
`;

    await sock.sendMessage(
      from,
      {
        text: message,
        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,
          externalAdReply: {
            title: "FLEX ZONE BOT",
            body: "Professional WhatsApp Bot System",
            sourceUrl: "https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s",
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: msg }
    );

  } catch (err) {

    console.error("SetDesc Error:", err);

    await send({
      text: `
🚨 *SYSTEM ERROR*

❌ Failed to update group description.

📌 *Possible Reason:*
• Bot is not admin in this group.

${config?.footer || ""}
`
    });

  }

};