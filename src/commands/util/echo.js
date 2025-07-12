import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("echo")
        .setDescription("Returns the user's input.")
        .addStringOption((option) =>
            option
                .setName("message")
                .setDescription("The message to echo back.")
                .setRequired(true)
        ),
    async execute(interaction) {
        const message = interaction.options.getString("message");
        await interaction.reply(message);
    },
};
