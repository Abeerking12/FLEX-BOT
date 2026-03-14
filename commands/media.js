const axios = require("axios");

module.exports = async ({ sock, from, msg, config, send, body }) => {

  try {

    // Get URL from command
    const args = body.split(" ");
    const url = args[1];

    // Check URL
    if (!url) {
      return await send({
        text: `Please provide a valid URL.

*Usage:* 
.media [url]

${config.footer}`
      });
    }

    // Processing message
    await send({
      text: "Processing request... Please wait."
    });

    // API endpoint
    const api =
      "https://tele-social.vercel.app/down?url=" +
      encodeURIComponent(url);

    // Fetch media
    const response = await axios.get(api);
    const data = response.data;

    // Check result
    if (!data || !data.video) {
      return await send({
        text: `Failed to download media.
Please check the link and try again.`
      });
    }

    // Send video
    await sock.sendMessage(
      from,
      {
        video: { url: data.video },
        caption: `*Media Downloaded Successfully*

Source: ${url}

${config.footer}`
      },
      { quoted: msg }
    );

  } catch (error) {

    console.error("Media Command Error:", error);

    await send({
      text: `❌ Error: Could not fetch media.
The server might be busy or the link is invalid.
Please try again.`
    });

  }

};