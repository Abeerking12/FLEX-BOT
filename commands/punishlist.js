const fs = require("fs");

module.exports = async ({ sock, from, msg, config, send }) => {

  try {

    const dbPath = "./database/punish.json";

    if (!fs.existsSync(dbPath)) {
      return send({
        text: `
⚠️ *PUNISHMENT DATABASE EMPTY*

No punishment records found.

🤖 *System:* ${config.botName}
${config.footer}
`
      });
    }

    const data = JSON.parse(fs.readFileSync(dbPath));
    const users = Object.keys(data);
    const now = Date.now();

    const active = users.filter(u => data[u] > now);

    if (active.length === 0) {
      return send({
        text: `
📋 *PUNISH LIST*

⚖️ The punishment list is currently empty.

🤖 *System:* ${config.botName}
${config.footer}
`
      });
    }

    let text = `
⚖️ *PROFESSOR PUNISHMENT LIST*

╭━━━〔 *PUNISHED USERS DIRECTORY* 〕━━━⬣
`;

    let mentions = [];

    active.forEach((user, i) => {

      const remaining =
        Math.round((data[user] - now) / 60000);

      text += `┃ ${i + 1}. @${user.split("@")[0]}
┃ ⏳ Remaining: ${remaining} mins
┃
`;

      mentions.push(user);

    });

    text += `╰━━━━━━━━━━━━━━━━⬣

📊 *Total Punished:* ${active.length}

${config.footer}
`;

    await sock.sendMessage(
      from,
      {
        image: { url: config.imageUrl },
        caption: text,
        mentions,

        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,

          externalAdReply: {
            title: config.botName,
            body: "Punished Users Directory",
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

    console.error("PunishList Error:", error);

    await send({
      text: `
❌ *SYSTEM ERROR*

Failed to fetch punishment list.

Please try again later.
`
    });

  }

};