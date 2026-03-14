module.exports = async ({ sock, from, msg, config, send }) => {

  // Only groups
  if (!from.endsWith("@g.us")) {
    return await send({
      text: "❌ This command is only for groups."
    });
  }

  const sender = msg.key.participant || from;

  // Get group metadata
  const metadata = await sock.groupMetadata(from);

  // Check if sender is admin
  const isAdmin = metadata.participants.find(p => p.id === sender)?.admin !== null;

  // Prevent kicking bot owner
  const isOwner =
    sender.includes(config.pairingNumber) ||
    sender.includes(global.owner);

  if (!isAdmin && !isOwner) {
    return await send({
      text: "❌ Only Admins or the Bot Owner can use this command."
    });
  }

  let target;

  // If replying to message
  if (
    msg.message?.extendedTextMessage?.contextInfo?.participant
  ) {
    target =
      msg.message.extendedTextMessage.contextInfo.participant;
  }

  // If user is mentioned
  else if (
    msg.message?.extendedTextMessage?.contextInfo?.mentionedJid
  ) {
    target =
      msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
  }

  if (!target) {
    return await send({
      text: "❌ Tag or reply to the user you want to kick."
    });
  }

  // Prevent kicking bot owner
  if (target.includes(config.pairingNumber)) {
    return await send({
      text: "❌ I cannot kick the Bot Owner."
    });
  }

  try {

    await sock.groupParticipantsUpdate(
      from,
      [target],
      "remove"
    );

    await send({
      text: `👋 *Successfully Removed:* @${target.split("@")[0]}`,
      mentions: [target]
    });

  } catch (err) {

    await send({
      text: "❌ Error: Failed to remove user."
    });

  }

};