import {
    setGuildSetting,
    getGuildSetting,
    getAllGuildSettings,
} from "../queries";
import defaultSettings from "../defaultSettings.js";
import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("settings")
        .setDescription("Manage guild settings")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("get")
                .setDescription("Get a specific setting")
                .addStringOption((option) =>
                    option
                        .setName("setting_name")
                        .setDescription("The name of the setting to retrieve")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("list")
                .setDescription("List all settings for the guild")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("reset")
                .setDescription("Reset a specific setting to its default value")
                .addStringOption((option) =>
                    option
                        .setName("setting_name")
                        .setDescription("The name of the setting to reset")
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("resetall")
                .setDescription("Reset all settings to their default values")
        ),
    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;

        if (subcommand === "resetall") {
            // Reset all settings to default
            for (const [key, value] of Object.entries(defaultSettings)) {
                await setGuildSetting(guildId, key, value);
            }
            await interaction.reply({
                content:
                    "All settings have been reset to their default values.",
                ephemeral: true,
            });
        } else {
            await interaction.reply({
                content: "This command is not yet implemented.",
                ephemeral: true,
            });
        }
    },
};
