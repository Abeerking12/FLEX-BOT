const fs = require("fs");

module.exports = async ({ sock, from, msg, config, send }) => {

  try {

    // Only group
    if (!from.endsWith("@g.us")) {
      return send({
        text: `
❌ *COMMAND NOT ALLOWED*

⚠️ This command works only in *Groups*.

🤖 *System:* ${config.botName}
${config.footer}
`
      });
    }

    const dbPath = "./database/punish.json";

    if (!fs.existsSync(dbPath)) {
      return send({
        text: `
⚠️ *PUNISHMENT DATABASE NOT FOUND*

No punishment records exist.
`
      });
    }

    let db = JSON.parse(fs.readFileSync(dbPath));

    const mentioned =
      msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

    if (mentioned.length === 0) {
      return send({
        text: `
❌ *NO USER SELECTED*

Please *mention a user* to release.

Example:
.release @user
`
      });
    }

    let released = [];

    mentioned.forEach(user => {
      if (db[user]) {
        delete db[user];
        released.push(user);
      }
    });

    if (released.length === 0) {
      return send({
        text: `
⚠️ *NO PUNISHED USERS FOUND*

The mentioned user is not under punishment.
`
      });
    }

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    const caption = `
⚖️ *PUNISHMENT RELEASED*

╭━━━〔 *RELEASE SYSTEM* 〕━━━⬣
┃ 👤 *Released Users:*
${released.map(u => `┃ ➤ @${u.split("@")[0]}`).join("\n")}
┃ ⚡ *Status:* Freedom Granted
╰━━━━━━━━━━━━━━━━⬣

💬 They can now send messages again.

🤖 *System:* ${config.botName}
${config.footer}
`;

    await sock.sendMessage(
      from,
      {
        image: { url: config.imageUrl },
        caption,
        mentions: released,

        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,

          externalAdReply: {
            title: config.botName,
            body: "Group Moderation System",
            thumbnailUrl: config.imageUrl,
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

    console.error("Release Command Error:", error);

    await send({
      text: `
🚨 *SYSTEM ERROR*

❌ Release command failed.

Please try again later.
`
    });

  }

};