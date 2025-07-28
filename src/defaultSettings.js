// These are default settings that apply to all guilds when the bot first joins.
// They can be configured via the /settings command. /settings reset and /settings resetall will utilize these values.
// It is not recommended to change these values if your bot is trying to run in a production setting for multiple guilds.

const defaultSettings = {
    channel_id: null,
    ping_role_id: null,
    birthday_message: "Happy birthday, {users}! 🎉",
    announcement_time: "09:00",
    timezone: "UTC",
};

const validSettings = Object.keys(defaultSettings);

export { defaultSettings, validSettings };
