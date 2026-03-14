module.exports = async ({ sock, from, config, send, command }) => {

  try {

    // Only for groups
    if (!from.endsWith("@g.us")) {
      return send({
        text: "❌ This command can only be used in groups."
      });
    }

    // Fetch group metadata
    const metadata = await sock.groupMetadata(from);

    const admins = metadata.participants.filter(p => p.admin !== null);
    const members = metadata.participants;

    const groupName = metadata.subject;

    /* ================= ADMINS LIST ================= */

    if (command === "admins") {

      let caption = `
╭━━━〔 🛡️ GROUP ADMINS 〕━━━╮

🏷️ *Group:* ${groupName}
👑 *Total Admins:* ${admins.length}

━━━━━━━━━━━━━━
`.trim();

      admins.forEach((user, index) => {
        const number = user.id.split("@")[0];
        caption += `\n${index + 1}. 👑 @${number}`;
      });

      caption += `

━━━━━━━━━━━━━━
🤖 *Bot:* ${config.botName}
${config.footer}
`.trim();

      await send({
        image: { url: config.imageUrl },
        caption,
        mentions: admins.map(a => a.id),

        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,

          forwardedNewsletterMessageInfo: {
            newsletterJid: config.channelJid,
            newsletterName: config.botName
          }
        }
      });

    }

    /* ================= MEMBERS LIST ================= */

    if (command === "members") {

      let text = `
╭━━━〔 👥 GROUP MEMBERS 〕━━━╮

🏷️ *Group:* ${groupName}
👥 *Total Members:* ${members.length}

━━━━━━━━━━━━━━
`.trim();

      members.forEach((user, index) => {
        const number = user.id.split("@")[0];
        text += `\n${index + 1}. 👤 @${number}`;
      });

      text += `

━━━━━━━━━━━━━━
🤖 *Bot:* ${config.botName}
${config.footer}
`.trim();

      await send({
        text,
        mentions: members.map(m => m.id),

        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,

          forwardedNewsletterMessageInfo: {
            newsletterJid: config.channelJid,
            newsletterName: config.botName
          }
        }
      });

    }

  } catch (err) {

    console.error("List Command Error:", err);

    await send({
      text: "❌ Error: Failed to fetch group list."
    });

  }

};