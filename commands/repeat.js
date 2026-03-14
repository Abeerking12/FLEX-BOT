module.exports = async ({ sock, from, msg, body, send, config }) => {

  try {

    const args = body.split(" ").slice(1);

    if (args.length < 2) {
      return send({
        text: `
❌ *INVALID FORMAT*

📌 *Usage Example*
.repeat 5 hello

🔁 This will repeat the text 5 times.

🤖 *System:* ${config.botName}
${config.footer}
`
      });
    }

    const count = parseInt(args[0]);
    const text = args.slice(1).join(" ");

    if (isNaN(count) || count <= 0) {
      return send({
        text: `
❌ *INVALID NUMBER*

Please enter a valid repeat number.

Example:
.repeat 5 hello
`
      });
    }

    if (count > 1000) {
      return send({
        text: `
⚠️ *SAFETY LIMIT*

Maximum repeat limit is *1000*.

Please use a smaller number.
`
      });
    }

    let result = "";

    for (let i = 0; i < count; i++) {
      result += text + " ";
    }

    const message = `
🔁 *TEXT REPEAT RESULT*

╭━━━〔 *REPEAT SYSTEM* 〕━━━⬣
┃ 🔢 *Repeat Count:* ${count}
┃ 📝 *Text:* ${text}
┃ ⚡ *System:* ${config.botName}
╰━━━━━━━━━━━━━━━━⬣

📢 *Result:*
${result.trim()}

${config.footer}
`;

    await sock.sendMessage(
      from,
      {
        image: { url: config.imageUrl },
        caption: message,

        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,

          externalAdReply: {
            title: config.botName,
            body: "Advanced WhatsApp Bot System",
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

    console.error("Repeat Command Error:", error);

    await send({
      text: `
🚨 *SYSTEM ERROR*

❌ Failed to execute repeat command.

Please try again later.

🤖 *System:* ${config.botName}
`
    });

  }

};