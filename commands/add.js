module.exports = async ({ sock, from, msg, config, send, body }) => {

  // command sirf groups ke liye
  if (!from.endsWith("@g.us")) {
    return await send({
      text: "❌ This command is only for groups."
    });
  }

  // group metadata
  const metadata = await sock.groupMetadata(from);

  // jis user ko add karna hai
  const target =
    msg.message?.extendedTextMessage?.contextInfo?.participant || from;

  // check admin
  const isAdmin =
    metadata.participants.find(p => p.id === target)?.admin ?? null;

  const isOwner = target.includes(config.ownerNumber);

  if (!isAdmin && !isOwner) {
    return await send({
      text: "❌ Permission Denied."
    });
  }

  // number extract
  let number = body.split(" ")[1];

  if (!number) {
    return await send({
      text: "❌ Please provide a number. Example: `.add 923xxxxxx`"
    });
  }

  number = number.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  try {

    const result = await sock.groupParticipantsUpdate(
      from,
      [number],
      "add"
    );

    if (result[0].status === "403") {

      await send({
        text: "❌ Privacy enabled. Sending invite instead."
      });

    } else {

      await send({
        text: `✅ User @${number.split("@")[0]} added successfully.`,
        mentions: [number]
      });

    }

  } catch (err) {

    await send({
      text: "❌ Error: Failed to add user. Check if the number is on WhatsApp."
    });

  }

};
