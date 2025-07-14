import {
    ChannelType,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import { setGuildSetting } from "../../queries.js";

export default {
    data: new SlashCommandBuilder()
        .setName("set-channel")
        .setDescription("Set the channel for birthday announcements.")
        .addChannelOption((option) =>
            option
                .setName("channel")
                .setDescription(
                    "The channel to send birthday announcements in."
                )
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const channel = interaction.options.getChannel("channel");
        const guildId = interaction.guild.id;

        if (channel.type !== ChannelType.GuildText) {
            return interaction.reply({
                content: "Please select a text channel for announcements.",
                ephemeral: true,
            });
        }

        try {
            await setGuildSetting(guildId, "channel_id", channel.id);
            await interaction.reply({
                content: `Birthday announcement channel set to ${channel.name}.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error("Error setting announcement channel:", error);
            await interaction.reply({
                content:
                    "Failed to set announcement channel. Please try again later.",
                ephemeral: true,
            });
        }
    },
};
