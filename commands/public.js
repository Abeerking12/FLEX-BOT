module.exports = async ({ send }) => {

  try {

    // Set bot mode to PUBLIC
    global.mode = "public";

    await send({
      text: `
🌍 *BOT MODE CHANGED*

🔓 Mode: *PUBLIC*

Now everyone can use the bot.
`
    });

  } catch (err) {

    console.error("Public Mode Error:", err);

    await send({
      text: "❌ Failed to change bot mode."
    });

  }

};