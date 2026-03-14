module.exports = async ({ sock, from, msg, config, send, body }) => {

  try {

    // group check
    if (!from.endsWith("@g.us")) return;

    const metadata = await sock.groupMetadata(from);
    const participants = metadata.participants;
    const groupName = metadata.subject;

    const message = body.split(" ").slice(1).join(" ") || "Attention everyone!";

    let text = `
📢 *Thelevel8 V1 TAG-ALL SYSTEM*

*Group:* ${groupName}

*Message:* ${message}

━━━━━━━━━━━━━━━━━━
`.trim();

    let mentions = [];

    for (let member of participants) {
      mentions.push(member.id);
      text += `\n🔹 @${member.id.split("@")[0]}`;
    }

    text += `

━━━━━━━━━━━━━━━━━━
📢 *OFFICIAL CHANNEL*

🔥 **JOIN FOR BOT UPDATES**

👉 https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s
━━━━━━━━━━━━━━━━━━

${config.footer}
`;

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
            title: "Thelevel8 V1",
            body: "Professional WhatsApp Bot System",
            mediaType: 1,
            thumbnailUrl: config.imageUrl,
            sourceUrl:
              "https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s"
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

    console.error("TagAll Error:", err);

    await send({
      text: "❌ Tag-all command failed."
    });

  }

};