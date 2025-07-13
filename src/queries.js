import { executeQuery } from "./db/db.js";

const createGuildSettingsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS guild_settings (
            guild_id VARCHAR(255) NOT NULL,
            setting_name VARCHAR(255) NOT NULL,
            setting_value TEXT,
            PRIMARY KEY (guild_id, setting_name)
        );
    `;

    await executeQuery(query);

    console.log("Guild settings table verified.");
};

const initializeGuildSettings = async (guildId) => {
    // These are default settings, do not change them unless you know what you're doing. They can be configured via the /settings command.
    const defaultSettings = {
        channel: null,
        ping_role_id: null,
        birthday_message: "Happy birthday, {users}! 🎉",
        announcement_time: "09:00",
        timezone: "UTC",
    };

    const query = `
        INSERT INTO guild_settings (guild_id, setting_name, setting_value)
        VALUES (?, ?, ?)
    `;
    const params = [guildId, "default", JSON.stringify(defaultSettings)];

    try {
        await executeQuery(query, params);
    } catch (error) {
        console.error("Error initializing guild settings:", error);
    }
};

const getGuildSetting = async (guildId, settingName) => {
    const query =
        "SELECT setting_value FROM guild_settings WHERE guild_id = ? AND setting_name = ?";
    const params = [guildId, settingName];

    try {
        const result = await executeQuery(query, params);
        return result.length > 0 ? JSON.parse(result[0].setting_value) : null;
    } catch (error) {
        console.error("Error fetching guild setting:", error);
        return null;
    }
};

const getAllGuildSettings = async (guildId) => {
    const query = "SELECT * FROM guild_settings WHERE guild_id = ?";
    const params = [guildId];

    try {
        const result = await executeQuery(query, params);
        return result.reduce((acc, row) => {
            acc[row.setting_name] = JSON.parse(row.setting_value);
            return acc;
        }, {});
    } catch (error) {
        console.error("Error fetching settings:", error);
        return {};
    }
};

const createBirthdayTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS birthdays (
            user_id VARCHAR(255) NOT NULL,
            birthday DATE NOT NULL,
            PRIMARY KEY (user_id)
        );
    `;

    await executeQuery(query);

    console.log("Birthday table verified.");
};

const setBirthday = async (userId, birthday) => {
    const query = `
        INSERT INTO birthdays (user_id, birthday)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE birthday = VALUES(birthday)
    `;
    const params = [userId, birthday];

    try {
        await executeQuery(query, params);
    } catch (error) {
        console.error("Error setting birthday:", error);
    }
};

const getBirthday = async (userId) => {
    const query = "SELECT * FROM birthdays WHERE user_id = ?";
    const params = [userId];

    try {
        const result = await executeQuery(query, params);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error("Error fetching birthday:", error);
    }
};

export {
    createGuildSettingsTable,
    initializeGuildSettings,
    getGuildSetting,
    getAllGuildSettings,
    createBirthdayTable,
    setBirthday,
    getBirthday,
};
