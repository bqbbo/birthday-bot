import {
    setGuildSetting,
    getGuildSetting,
    getAllGuildSettings,
} from "../queries.js";
import { defaultSettings, validSettings } from "../defaultSettings.js";
import { SlashCommandBuilder } from "discord.js";

const handleError = async (interaction, action, error = null) => {
    console.error(`Error ${action}:`, error);
    await interaction.reply({
        content: `Failed to ${action}.`,
        ephemeral: true,
    });
};

const handleSuccess = async (interaction, message) => {
    await interaction.reply({
        content: message,
        ephemeral: true,
    });
};

const commandHandlers = {
    async resetall(interaction, guildId) {
        try {
            await Promise.all(
                Object.entries(defaultSettings).map(([key, value]) =>
                    setGuildSetting(guildId, key, value)
                )
            );
            await handleSuccess(
                interaction,
                "All settings have been reset to their default values."
            );
        } catch (error) {
            await handleError(interaction, "reset all settings", error);
        }
    },

    async reset(interaction, guildId) {
        const settingName = interaction.options.getString("setting_name");

        try {
            await setGuildSetting(
                guildId,
                settingName,
                defaultSettings[settingName]
            );
            await handleSuccess(
                interaction,
                `Setting ${settingName} has been reset to its default value.`
            );
        } catch (error) {
            await handleError(
                interaction,
                `reset setting ${settingName}`,
                error
            );
        }
    },

    async set(interaction, guildId) {
        const settingName = interaction.options.getString("setting_name");
        const settingValue = interaction.options.getString("setting_value");

        try {
            await setGuildSetting(guildId, settingName, settingValue);
            await handleSuccess(
                interaction,
                `Setting ${settingName} has been updated to ${settingValue}.`
            );
        } catch (error) {
            await handleError(
                interaction,
                `update setting ${settingName}`,
                error
            );
        }
    },

    async get(interaction, guildId) {
        const settingName = interaction.options.getString("setting_name");

        try {
            const settingValue = await getGuildSetting(guildId, settingName);

            const message =
                settingValue === null
                    ? `Setting ${settingName} is not set.`
                    : `The value of ${settingName} is: ${settingValue}`;

            await handleSuccess(interaction, message);
        } catch (error) {
            await handleError(
                interaction,
                `retrieve setting ${settingName}`,
                error
            );
        }
    },

    async list(interaction, guildId) {
        try {
            const settings = await getAllGuildSettings(guildId);

            if (Object.keys(settings).length === 0) {
                await handleSuccess(
                    interaction,
                    "No settings found for this guild."
                );
                return;
            }

            const settingsList = Object.entries(settings)
                .map(
                    ([key, value]) =>
                        `${key}: ${value} (Default: ${defaultSettings[key]})`
                )
                .join("\n");

            await handleSuccess(
                interaction,
                `Current settings for this guild:\n${settingsList}`
            );
        } catch (error) {
            await handleError(interaction, "retrieve settings", error);
        }
    },
};

const createSettingChoices = () =>
    validSettings.map((setting) => ({ name: setting, value: setting }));

const createSettingOption =
    (name, description, required = true) =>
    (option) =>
        option
            .setName(name)
            .setDescription(description)
            .setRequired(required)
            .addChoices(...createSettingChoices());

export default {
    data: new SlashCommandBuilder()
        .setName("settings")
        .setDescription("Manage guild settings")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("get")
                .setDescription("Get the value of a specific setting")
                .addStringOption(
                    createSettingOption(
                        "setting_name",
                        "The name of the setting to retrieve"
                    )
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
                .addStringOption(
                    createSettingOption(
                        "setting_name",
                        "The name of the setting to reset"
                    )
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("resetall")
                .setDescription("Reset all settings to their default values")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("set")
                .setDescription("Set a specific setting")
                .addStringOption(
                    createSettingOption(
                        "setting_name",
                        "The name of the setting to set"
                    )
                )
                .addStringOption((option) =>
                    option
                        .setName("setting_value")
                        .setDescription("The new value for the setting")
                        .setRequired(true)
                )
        ),

    async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const guildId = interaction.guild.id;

        const handler = commandHandlers[subcommand];
        if (handler) {
            await handler(interaction, guildId);
        } else {
            await handleSuccess(
                interaction,
                "This command is not yet implemented."
            );
        }
    },
};
