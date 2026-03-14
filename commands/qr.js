module.exports = async ({ sock, from, msg, body, config, send }) => {

  try {

    const text = body.split(" ").slice(1).join(" ");

    if (!text) {
      return send({
        text: `
❌ *QR GENERATOR ERROR*

⚠️ Please provide *text or a URL* to generate QR.

📌 *Example:*
.qr Hello World
.qr https://google.com

🤖 *System:* ${config.botName}
${config.footer}
`
      });
    }

    const qrUrl =
      "https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=" +
      encodeURIComponent(text);

    const caption = `
📱 *QR CODE GENERATED*

╭━━━〔 *QR GENERATOR* 〕━━━⬣
┃ 📦 *Content:* ${text}
┃ ⚡ *System:* ${config.botName}
╰━━━━━━━━━━━━━━━━⬣

📷 Scan this QR code to access the content.

${config.footer}
`;

    await sock.sendMessage(
      from,
      {
        image: { url: qrUrl },
        caption,

        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,

          externalAdReply: {
            title: config.botName,
            body: "QR Code Generator System",
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

    console.error("QR Generator Error:", error);

    await send({
      text: `
🚨 *SYSTEM ERROR*

❌ Failed to generate QR Code.

Please try again later.

🤖 *System:* ${config.botName}
`
    });

  }

};