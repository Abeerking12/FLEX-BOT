const axios = require("axios");

module.exports = async ({ sock, from, msg, config, body, send }) => {

  try {

    // Get search keyword
    const args = body.split(" ").slice(1);
    const keyword = args.join(" ");

    if (!keyword) {
      return await send({
        text: "❌ *Please provide a keyword!*\nExample: `.dp aesthetic`"
      });
    }

    // Searching message
    await sock.sendMessage(
      from,
      {
        image: { url: "https://i.ibb.co/fdKhGqKb/b1f1.png" },
        caption: `🔍 *FLEX ZONE V1 SYSTEM*\n\n🖼️ *Searching DP collection for:* "${keyword}"\n🚀 *Sending 10 premium DPs...*`,
        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,
          forwardedNewsletterMessageInfo: {
            newsletterJid: config.channelJid,
            newsletterName: config.botName
          }
        }
      },
      { quoted: msg }
    );

    // Pinterest API
    const response = await axios.get(
      `https://pinterest-search.apis-bj-devs.workers.dev/?search=${encodeURIComponent(keyword)}&limit=10`
    );

    const results = response.data?.result?.pins || [];

    if (results.length === 0) {
      return await send({
        text: "❌ *No images found for this keyword.*"
      });
    }

    // Send images
    for (let i = 0; i < results.length; i++) {

      const image =
        results[i]?.media?.images?.large?.url ||
        results[i]?.media?.images?.url;

      if (!image) continue;

      await sock.sendMessage(
        from,
        {
          image: { url: image },
          caption:
`> *༒༒ 𝗗𝗣 𝗖𝗢𝗟𝗟𝗘𝗖𝗧𝗜𝗢𝗡 ༒༒*

🖼️ *Result:* ${i + 1}/10
🔥 *Keyword:* ${keyword}

👤 *By:* ${config.botName}`,

          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: config.channelJid,
              newsletterName: config.botName
            },
            externalAdReply: {
              title: `DP Search - ${keyword.toUpperCase()}`,
              body: "ABHEE-x-FLEX DP DOWNLOADER",
              thumbnailUrl: image,
              mediaType: 1,
              renderLargerThumbnail: true,
              sourceUrl: "https://whatsapp.com/channel/0029Vb7FZ4lBPzjb8g1Tux3l"
            }
          }
        },
        { quoted: msg }
      );

      // small delay
      if (i < results.length - 1) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    await send({
      text: "✅ *All 10 images sent successfully!*"
    });

  } catch (err) {

    console.error("Error:", err.message);

    await send({
      text: "❌ *Server Error: Pinterest database is currently unreachable.*"
    });

  }

};