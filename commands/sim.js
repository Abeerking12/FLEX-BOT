const axios = require("axios");

module.exports = async ({ sock, from, msg, config, body, send }) => {

  try {

    const args = body.split(" ").slice(1);
    const number = args[0];

    if (!number) {
      return send({
        text:
`⚠️ *Please provide a phone number!*

Example:
.sim 03001234567
.sim 923001234567`
      });
    }

    await sock.sendMessage(
      from,
      { text: "🔍 *Scanning SIM database...*" },
      { quoted: msg }
    );

    let apiUrl;

    if (number.startsWith("03")) {
      apiUrl = `https://example-api.com/simdata.php?phone=92${number.slice(1)}`;
    } else if (number.startsWith("92")) {
      apiUrl = `https://example-api.com/simdata.php?phone=${number}`;
    } else {
      apiUrl = `https://example-api.com/simdata.php?phone=${number}`;
    }

    const response = await axios.get(apiUrl, { timeout: 10000 });

    const records = response.data?.records;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return send({
        text: `❌ *NO RECORD FOUND*

Phone Number: ${number}`
      });
    }

    for (let i = 0; i < records.length; i++) {

      const r = records[i];

      const caption =
`🔍 *FLEX ZONE SIM DATABASE*

━━━━━━━━━━━━━━

📞 *Mobile:* ${r.Mobile || "N/A"}
👤 *Name:* ${r.Name || "N/A"}
🆔 *CNIC:* ${r.CNIC || "N/A"}
🏠 *Address:* ${r.Address || "N/A"}
🏳️ *Country:* ${r.Country || "N/A"}

━━━━━━━━━━━━━━
📊 *Record:* ${i + 1} of ${records.length}

📢 *OFFICIAL CHANNEL*

https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s

${config.footer}`;

      await sock.sendMessage(
        from,
        {
          image: {
            url: "https://i.ibb.co/fdKxxxx/sim-database.jpg"
          },
          caption,
          contextInfo: {
            isForwarded: true,
            forwardingScore: 999,
            forwardedNewsletterMessageInfo: {
              newsletterJid: config.channelJid,
              newsletterName: config.botName
            },
            externalAdReply: {
              title: "FLEX ZONE SIM DATABASE",
              body: "Professional WhatsApp Bot System",
              thumbnailUrl:
                "https://i.ibb.co/fdKxxxx/sim-database.jpg",
              sourceUrl:
                "https://whatsapp.com/channel/0029Vb6t0UEKGGGGSZPzS71s",
              mediaType: 1
            }
          }
        },
        { quoted: msg }
      );

    }

  } catch (err) {

    console.error("SIM API Error:", err);

    await send({
      text: "❌ SIM API Error: Failed to fetch data."
    });

  }

};