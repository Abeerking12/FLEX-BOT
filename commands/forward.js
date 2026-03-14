module.exports = async ({ sock, from, msg, config, send, body }) => {

  try {

    // Check if message is replied
    const quotedMessage =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    if (!quotedMessage) {
      return await send({
        text: "❌ Please reply to a message first."
      });
    }

    // Get target (number or group link)
    const args = body.split(" ");
    let target = args[1];

    if (!target) {
      return await send({
        text: "❌ Please provide a phone number or group link.\nExample: `.forward [number/link]`"
      });
    }

    let jid;

    // If group link
    if (target.includes("chat.whatsapp.com")) {

      const inviteCode = target.split("chat.whatsapp.com/")[1];
      const groupInfo = await sock.groupGetInviteInfo(inviteCode);

      jid = groupInfo.id;

    } else {

      // Convert number → WhatsApp JID
      jid = target.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    }

    // Forward message
    await sock.sendMessage(
      jid,
      {
        forward: {
          key: msg.key,
          message: quotedMessage
        },

        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,

          externalAdReply: {
            title: config.botName,
            body: "Forwarding System",
            mediaType: 1,
            thumbnailUrl: config.imageUrl,
            sourceUrl: "https://whatsapp.com/channel/0029Vb7FZ4lBPzjb8g1Tux3l"
          },

          forwardedNewsletterMessageInfo: {
            newsletterJid: config.channelJid,
            newsletterName: config.botName
          }
        }
      }
    );

    // Success message
    await send({
      image: { url: config.imageUrl },
      caption:
`✅ *Forwarded Successfully!*

Target: ${target}

${config.footer}`,
      contextInfo: {
        isForwarded: true,
        forwardingScore: 999
      }
    });

  } catch (err) {

    console.error(err);

    await send({
      text: "❌ *Error:* Forwarding failed."
    });

  }

};