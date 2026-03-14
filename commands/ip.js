const axios = require("axios");

module.exports = async ({ sock, from, msg, config, body, send }) => {

  // Command argument (IP)
  const args = body.split(" ").slice(1);
  const ip = args[0];

  if (!ip) {
    return await send({
      text: "Example:\n.ip 8.8.8.8"
    });
  }

  // Processing message
  await sock.sendMessage(
    from,
    {
      text: "🛰️ *[ SCANNING IP NETWORK ]*\n\nLocating country and ISP data..."
    },
    { quoted: msg }
  );

  try {

    // API request
    const response = await axios.get(`https://ipwho.is/${ip}`);
    const data = response.data;

    if (!data.success) {
      return await send({
        text: `Invalid IP ${data.message || "Unknown error"}`
      });
    }

    const thumbnail = "https://i.ibb.co/d0zRsfTk/1766952170010.jpg";

    const caption =
`┏━━━━━━━⬣ 🌍 IP & NETWORK TRACK ⬣━━━━━━━┓
┃
┃ 🌐 *IP:* ${data.ip}
┃ 📍 *Country:* ${data.country} (${data.country_code})
┃ 🏙️ *City:* ${data.city}
┃ 📮 *ZIP:* ${data.postal}
┃ 📡 *ISP:* ${data.isp}
┃ 🗺️ *Lat/Long:* ${data.latitude}, ${data.longitude}
┃ 🛡️ *Proxy:* ${data.connection?.proxy ? "🟢 Yes" : "🔴 No"}
┃
┃ 🔗 *Google Map:*
┃ https://www.google.com/maps?q=${data.latitude},${data.longitude}
┃
┗━━━━━━━━━━━━━━━━━━━━━━┛

${config.footer}`;

    await sock.sendMessage(
      from,
      {
        image: { url: thumbnail },
        caption,
        contextInfo: {
          isForwarded: true,
          forwardingScore: 999,

          forwardedNewsletterMessageInfo: {
            newsletterJid: config.channelJid,
            newsletterName: config.botName
          },

          externalAdReply: {
            title: "IP Lookup System",
            body: `City: ${data.city}, ${data.country}`,
            thumbnailUrl: thumbnail,
            sourceUrl: "https://whatsapp.com/channel/0029VaFpx7u",
            mediaType: 1,
            renderLargerThumbnail: true
          }
        }
      },
      { quoted: msg }
    );

  } catch (err) {

    console.error("IP Lookup Error:", err.message);

    await send({
      text: "🚨 *SYSTEM ERROR*\nAPI request failed. Try again later."
    });

  }

};