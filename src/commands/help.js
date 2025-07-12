import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Provides a list of available commands."),
    async execute(interaction) {
        const commands = interaction.client.commands
            .map((cmd) => `/${cmd.data.name} - ${cmd.data.description}`)
            .join("\n");
        await interaction.reply(`Available commands:\n${commands}`);
    },
};
