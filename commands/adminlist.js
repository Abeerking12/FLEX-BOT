module.exports = async ({ sock, from, msg, config, send }) => {

  try {

    // command sirf group me chalega
    if (!from.endsWith("@g.us")) {
      return await send({
        text: "❌ This command is only for groups."
      });
    }

    // group metadata
    const metadata = await sock.groupMetadata(from);

    const participants = metadata.participants;

    // sirf admins filter
    const admins = participants.filter(p => p.admin !== null);

    let text = `🛡️ *${metadata.subject} ADMIN LIST*\n\n`;

    let mentions = [];

    admins.forEach((user, index) => {
      text += `${index + 1}. @${user.id.split("@")[0]}\n`;
      mentions.push(user.id);
    });

    text += `\nTotal Admins: ${admins.length}\n\n${config.footer}`;

    // message send
    await sock.sendMessage(
      from,
      {
        image: { url: config.imageUrl },
        caption: text,
        mentions: mentions,
        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,
          externalAdReply: {
            title: config.botName,
            body: `Admin List of ${metadata.subject}`,
            mediaType: 1,
            thumbnailUrl: config.imageUrl,
            sourceUrl: "https://whatsapp.com/channel/0"
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

    console.error(err);

    await send({
      text: "❌ Error: Failed to fetch admin list."
    });

  }

};