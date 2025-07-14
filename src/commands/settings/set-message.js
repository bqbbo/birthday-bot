import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { setGuildSetting } from "../../queries.js";

export default {
    data: new SlashCommandBuilder()
        .setName("set-message")
        .setDescription("Set the birthday announcement message.")
        .addStringOption((option) =>
            option
                .setName("message")
                .setDescription(
                    "The message to set for birthday announcements."
                )
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const message = interaction.options.getString("message");
        const guildId = interaction.guild.id;

        try {
            await setGuildSetting(guildId, "birthday_message", message);
            await interaction.reply({
                content: `Birthday announcement message set successfully.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error("Error setting announcement message:", error);
            await interaction.reply({
                content:
                    "Failed to set announcement message. Please try again later.",
                ephemeral: true,
            });
        }
    },
};
