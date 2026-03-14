const fs = require("fs");
const path = require("path");

const dbFolder = "./database";
const warnFile = path.join(dbFolder, "warns.json");

// ensure database exists
if (!fs.existsSync(dbFolder)) fs.mkdirSync(dbFolder);
if (!fs.existsSync(warnFile)) fs.writeFileSync(warnFile, JSON.stringify({}));

module.exports = async ({ sock, from, msg, config, send }) => {

  try {

    // only groups
    if (!from.endsWith("@g.us")) {
      return send({ text: "❌ This command can only be used in groups." });
    }

    const metadata = await sock.groupMetadata(from);
    const participants = metadata.participants;

    const sender = msg.key.participant || msg.key.remoteJid;
    const isAdmin = participants.find(p => p.id === sender)?.admin;

    if (!isAdmin) {
      return send({ text: "❌ Only group admins can use this command." });
    }

    // target user
    const target =
      msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] ||
      msg.message?.extendedTextMessage?.contextInfo?.participant;

    if (!target) {
      return send({ text: "⚠️ Please reply or tag a user to warn them." });
    }

    // load warn database
    let warnDB = JSON.parse(fs.readFileSync(warnFile, "utf-8"));

    if (!warnDB[from]) warnDB[from] = {};
    if (!warnDB[from][target]) warnDB[from][target] = 0;

    warnDB[from][target] += 1;

    const warnCount = warnDB[from][target];
    const warnLimit = 3;

    // if limit reached
    if (warnCount >= warnLimit) {

      await sock.groupParticipantsUpdate(from, [target], "remove");

      delete warnDB[from][target];

      fs.writeFileSync(warnFile, JSON.stringify(warnDB, null, 2));

      return await sock.sendMessage(
        from,
        {
          image: { url: config.imageUrl },
          caption: `
🚫 *USER REMOVED*

User: @${target.split("@")[0]}

Reason: Exceeded ${warnLimit} warnings.

${config.footer}
`,
          mentions: [target]
        },
        { quoted: msg }
      );
    }

    // save database
    fs.writeFileSync(warnFile, JSON.stringify(warnDB, null, 2));

    // warning message
    await sock.sendMessage(
      from,
      {
        image: { url: config.imageUrl },
        caption: `
⚠️ *GROUP WARNING*

User: @${target.split("@")[0]}

Warning: ${warnCount}/${warnLimit}

*Caution:* You will be removed after ${warnLimit} warnings.

${config.footer}
`,
        mentions: [target]
      },
      { quoted: msg }
    );

  } catch (err) {

    console.error("Warn Command Error:", err);

    await send({
      text: "❌ Failed to process warning command."
    });

  }

};