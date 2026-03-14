const axios = require("axios");

module.exports = async ({ sock, from, msg, config, body, send }) => {

  try {

    const args = body.trim().split(/\s+/).slice(1);

    if (args.length < 3) {
      return send({
        text:
`💱 *Currency Converter*

Example:
.currency 100 USD PKR

Format:
.currency <amount> <from> <to>

Supported:
USD EUR GBP PKR INR AED SAR CAD AUD JPY`
      });
    }

    const amount = Number(args[0]);
    const fromCurrency = args[1].toUpperCase();
    const toCurrency = args[2].toUpperCase();

    if (isNaN(amount)) {
      return send({
        text: "❌ Invalid amount. Example: .currency 100 USD PKR"
      });
    }

    // API request
    const response = await axios.get(
      `https://open.er-api.com/v6/latest/${fromCurrency}`
    );

    if (response.data.result !== "success") {
      return send({
        text: "❌ Currency API error. Try again later."
      });
    }

    const rate = response.data.rates[toCurrency];

    if (!rate) {
      return send({
        text: `❌ Unsupported currency code: ${toCurrency}`
      });
    }

    const converted = (amount * rate).toFixed(2);

    const message = `
💱 *CURRENCY CONVERSION*

💰 Amount
${amount} ${fromCurrency}

🔄 Converted
${converted} ${toCurrency}

📊 Exchange Rate
1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}

${config.footer}
`.trim();

    await sock.sendMessage(
      from,
      {
        image: { url: config.imageUrl },
        caption: message,
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

  } catch (error) {

    console.error("Currency Error:", error.message);

    await send({
      text: "❌ Currency service temporarily unavailable."
    });

  }

};