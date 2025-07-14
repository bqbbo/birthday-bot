import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { setGuildSetting } from "../../queries.js";

const validateTime = (time) => {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(time);
};

export default {
    data: new SlashCommandBuilder()
        .setName("set-announcement-time")
        .setDescription(
            "Set the time for birthday announcements, relative to your timezone."
        )
        .addStringOption((option) =>
            option
                .setName("time")
                .setDescription("The time for birthday announcements.")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const time = interaction.options.getString("time");
        const guildId = interaction.guild.id;

        if (!validateTime(time)) {
            return interaction.reply({
                content:
                    "Invalid time format. Please use HH:MM (24-hour format).",
                ephemeral: true,
            });
        }

        try {
            await setGuildSetting(guildId, "announcement_time", time);
            await interaction.reply({
                content: `Announcement time set to ${time}.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error("Error setting announcement time:", error);
            await interaction.reply({
                content:
                    "Failed to set announcement time. Please try again later.",
                ephemeral: true,
            });
        }
    },
};
