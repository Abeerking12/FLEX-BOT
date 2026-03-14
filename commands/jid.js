module.exports = async ({ sock, from, msg, send, config }) => {

  try {

    // Detect target JID (mentioned / replied / current chat)
    const jid =
      msg.message?.extendedTextMessage?.contextInfo?.participant ||
      msg.message?.extendedTextMessage?.contextInfo?.remoteJid ||
      from;

    // Message text
    const text =
`*ID:* ${jid}

*Channel Link:* https://whatsapp.com/channel/0029Vb7FZ4lBPzjb8g1Tux3l`;

    // Send message
    await sock.sendMessage(
      from,
      { text },
      { quoted: msg }
    );

  } catch (err) {

    console.error(err);

    await send({
      text: "❌ *Error:* Could not fetch JID."
    });

  }

};