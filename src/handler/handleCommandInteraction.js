import { MessageFlags } from "discord.js";

const handleCommandInteraction = async (interaction) => {
    const command = interaction.client.commands.get(interaction.commandName);

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`An error occurred during command execution: ${error}`);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: "There was an error while executing this command.",
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.reply({
                content: "There was an error while executing this command.",
                flags: MessageFlags.Ephemeral,
            });
        }
    }
};

export default handleCommandInteraction;
