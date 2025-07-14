import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { setGuildSetting } from "../../queries.js";
import timezones from "../../timezones.js";

export default {
    data: new SlashCommandBuilder()
        .setName("set-timezone")
        .setDescription("Set the timezone for birthday announcements.")
        .addStringOption((option) =>
            option
                .setName("timezone")
                .setDescription("The timezone to set for the guild.")
                .setRequired(true)
                .addChoices(
                    ...Object.entries(timezones).map(([key, value]) => ({
                        name: `${key} (${value})`,
                        value: key,
                    }))
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const timezone = interaction.options.getString("timezone");
        const guildId = interaction.guild.id;

        try {
            await setGuildSetting(guildId, "timezone", timezone);
            await interaction.reply({
                content: `Timezone set to ${timezone}.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error("Error setting timezone:", error);
            await interaction.reply({
                content: "Failed to set timezone. Please try again later.",
                ephemeral: true,
            });
        }
    },
};
