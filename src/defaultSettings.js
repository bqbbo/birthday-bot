// These are default settings, do not change them unless you know what you're doing.
// They can be configured via the /settings command. /settings reset and /settings resetall will utilize these values.

const defaultSettings = {
    channel_id: null,
    ping_role_id: null,
    birthday_message: "Happy birthday, {users}! 🎉",
    announcement_time: "09:00",
    timezone: "UTC",
};

const validSettings = Object.keys(defaultSettings);

export { defaultSettings, validSettings };
