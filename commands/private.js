module.exports = async ({ send }) => {

  try {

    // Set bot mode to PRIVATE
    global.mode = "private";

    await send({
      text: `
🔐 *Bot Mode: PRIVATE*

Now only Owner can use the bot.
`
    });

  } catch (err) {

    console.error("Private Mode Error:", err);

    await send({
      text: "❌ Failed to change bot mode."
    });

  }

};