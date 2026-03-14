const fs = require("fs");

module.exports = async ({ send, config }) => {

  const logFile = "./database/deleted_log.json";

  try {

    // agar file exist karti hai
    if (fs.existsSync(logFile)) {

      // database clear
      fs.writeFileSync(logFile, JSON.stringify([], null, 2));

      await send({
        image: { url: config.imageUrl },
        caption: `
༒༒ *DATABASE CLEARED* ༒༒

✅ Deleted messages history has been wiped out successfully.

${config.footer}
`.trim()
      });

    } else {

      await send({
        text: "❗ No logs found to clear."
      });

    }

  } catch (err) {

    console.error(err);

    await send({
      text: "❌ Database clear karne mein masla aya."
    });

  }

};