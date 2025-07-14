import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { setGuildSetting } from "../../queries.js";

export default {
    data: new SlashCommandBuilder()
        .setName("set-role")
        .setDescription("Set the pinging role for birthday announcements.")
        .addRoleOption((option) =>
            option
                .setName("role")
                .setDescription("The role to ping for birthday announcements.")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const role = interaction.options.getRole("role");
        const guildId = interaction.guild.id;

        try {
            await setGuildSetting(guildId, "ping_role_id", role.id);
            await interaction.reply({
                content: `Birthday announcement ping role set to ${role.name}.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error("Error setting ping role:", error);
            await interaction.reply({
                content: "Failed to set ping role. Please try again later.",
                ephemeral: true,
            });
        }
    },
};
