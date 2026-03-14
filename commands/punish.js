const fs = require("fs");
const path = require("path");

module.exports = async ({ sock, from, msg, config, send }) => {

  try {

    // Only work in groups
    if (!from.endsWith("@g.us")) {
      return send({
        text: "❌ This command works only in groups."
      });
    }

    // Check sender
    const sender =
      msg.message?.extendedTextMessage?.contextInfo?.participant || from;

    // Get group metadata
    const group = await sock.groupMetadata(from);

    // Check admin
    const isAdmin =
      group.participants.find(p => p.id === sender)?.admin || null;

    const isOwner =
      sender.includes(config.pairingNumber) ||
      (global.tempOwner && sender.includes(global.tempOwner));

    if (!isAdmin && !isOwner) {
      return send({
        text: "❌ Permission denied. Only admins can use this command."
      });
    }

    // Database path
    const dbFolder = "./database";
    const dbFile = "./database/punish.json";

    if (!fs.existsSync(dbFolder)) {
      fs.mkdirSync(dbFolder);
    }

    // Get mentioned users
    let mentioned =
      msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

    let users = [];

    if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
      users.push(
        msg.message.extendedTextMessage.contextInfo.participant
      );
    }

    mentioned.forEach(user => {
      if (!users.includes(user)) users.push(user);
    });

    if (users.length === 0) {
      return send({
        text: "❌ Reply to someone or mention users to punish."
      });
    }

    // Prevent punishing admins
    for (let user of users) {

      const isTargetAdmin =
        group.participants.find(p => p.id === user)?.admin || null;

      const isTargetOwner = user.includes(config.pairingNumber);

      if (isTargetAdmin || isTargetOwner) {
        return send({
          text: "❌ You cannot punish an Admin or the Bot Owner."
        });
      }
    }

    // Load database
    let punishDB = fs.existsSync(dbFile)
      ? JSON.parse(fs.readFileSync(dbFile))
      : {};

    const now = Date.now();

    const duration = 30 * 60 * 1000; // 30 minutes

    users.forEach(user => {
      punishDB[user] = now + duration;
    });

    fs.writeFileSync(dbFile, JSON.stringify(punishDB, null, 2));

    // Message
    let text = `
⚖️ *PROFESSOR PUNISHMENT ACTIVATED*

👤 *Punished Users:*
${users.map(u => "@" + u.split("@")[0]).join("\n")}

⏰ *Duration:* 30 Minutes

⚠️ *Effect:* All their messages will be auto-deleted.

${config.footer}
`;

    await sock.sendMessage(
      from,
      {
        image: { url: "https://i.ibb.co/fdK/hGqKb/b1f1.jpg" },
        caption: text,
        mentions: users,

        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,

          externalAdReply: {
            title: "PROFESSOR PUNISH SYSTEM",
            body: "Automatic Group Moderation",
            thumbnailUrl: "https://i.ibb.co/fdK/hGqKb/b1f1.jpg",
            sourceUrl:
              "https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s",
            mediaType: 1
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

    console.error("Punish Error:", err);

    await send({
      text: "❌ Error: Punishment command failed."
    });

  }

};