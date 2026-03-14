module.exports = async ({ send, config }) => {

  try {

    // Start time
    const start = Date.now();

    // End time
    const end = Date.now();

    // Calculate speed
    const speed = end - start;

    // Send response
    await send({
      image: { url: config.imageUrl },

      caption: `
༒༒ *PING* ༒༒
⚡ Speed: ${speed} ms

${config.footer}
`.trim()

    });

  } catch (err) {

    console.error("Ping Command Error:", err);

  }

};