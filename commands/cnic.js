const axios = require("axios");

module.exports = async ({ sock, from, msg, config, body, send }) => {

  const args = body.split(" ").slice(1);
  const query = args[0];

  // agar number / cnic na ho
  if (!query) {
    return await send({
      text: `⚠️ Please provide a SIM number or CNIC!

Example: .cnic 03xxxxxxxxx`
    });
  }

  await sock.sendMessage(
    from,
    { text: "🔍 Fetching SIM database records..." },
    { quoted: msg }
  );

  try {

    const apiUrl =
      "https://famo-official.serv00.net/api/famofc_simdata.php?number=" +
      encodeURIComponent(query);

    const res = await axios.get(apiUrl);
    const data = res.data;

    if (!data.success || !data.data || data.data.length === 0) {
      return await send({
        text: `❌ No information found for: ${query}`
      });
    }

    const image =
      "https://i.ibb.co/fdKHLHQ/b72b78705e.jpg";

    for (let i = 0; i < data.data.length; i++) {

      const record = data.data[i];

      const caption = `
┏━━━━━━━⬣ SIM DATABASE
┃
┃ 👤 Name: ${record.name || "N/A"}
┃ 🆔 CNIC: ${record.cnic || "N/A"}
┃ 📞 Number: ${record.number || "N/A"}
┃ 🏠 Address: ${record.address || "N/A"}
┃
┗━━━━━━━⬣

Credit: PROFESSOR-PARI

${config.footer}
`.trim();

      await sock.sendMessage(
        from,
        {
          image: { url: image },
          caption: caption,
          contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: config.channelJid,
              newsletterName: config.botName
            }
          }
        },
        { quoted: msg }
      );

    }

  } catch (err) {

    console.error("Database Error:", err);

    await send({
      text: "❌ Server error. Database is currently offline."
    });

  }

};