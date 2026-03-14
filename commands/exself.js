module.exports = async ({ sock, from, msg, config, send }) => {
  try {

    // Reset temporary owner
    global.tempOwner = null;

    // Send message
    await send({
      image: { url: config.imageUrl },
      caption: `*OWNERSHIP EXPIRED*
Manual Reset

Status: Manual Reset
Session: Terminating session.

${config.footer}`,
      contextInfo: {
        isForwarded: true,
        forwardingScore: 999
      }
    });

  } catch (error) {

    // Error message
    await send({
      text: "Error terminating session."
    });

  }
};