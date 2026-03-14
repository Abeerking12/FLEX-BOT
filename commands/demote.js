module.exports = async ({ sock, from, msg, config, send }) => {

  try {

    // group check
    if (!from.endsWith("@g.us")) {
      return send({
        text: "❌ This command only works in groups."
      });
    }

    const metadata = await sock.groupMetadata(from);
    const sender = msg.key.participant || msg.key.remoteJid;

    // check if sender admin
    const isAdmin = metadata.participants.find(p => p.id === sender)?.admin;

    // check if bot admin
    const botId = sock.user.id.split(":")[0] + "@s.whatsapp.net";
    const isBotAdmin = metadata.participants.find(p => p.id === botId)?.admin;

    if (!isAdmin) {
      return send({
        text: "❌ Only admins can use this command."
      });
    }

    if (!isBotAdmin) {
      return send({
        text: "❌ Bot must be admin to demote users."
      });
    }

    // target user
    let target;

    if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
      target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    }

    if (!target) {
      return send({
        text: "❌ Please mention or reply to a user to demote."
      });
    }

    // demote user
    await sock.groupParticipantsUpdate(from, [target], "demote");

    const caption = `
⬇️ *USER DEMOTED*

👤 Target: @${target.split("@")[0]}

Status: Now a Member

${config.footer}
`.trim();

    await sock.sendMessage(
      from,
      {
        image: { url: config.imageUrl },
        caption,
        mentions: [target],
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: config.channelJid,
            newsletterName: config.botName
          }
        }
      },
      { quoted: msg }
    );

  } catch (err) {

    console.error(err);

    await send({
      text: "❌ Error while demoting user."
    });

  }

};