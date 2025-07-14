const timezones = {
    UTC: "UTC+00:00",
    "America/New_York": "UTC-05:00",
    "America/Chicago": "UTC-06:00",
    "America/Denver": "UTC-07:00",
    "America/Los_Angeles": "UTC-08:00",
    "Europe/London": "UTC+00:00",
    "Europe/Berlin": "UTC+01:00",
    "Europe/Paris": "UTC+01:00",
    "Asia/Tokyo": "UTC+09:00",
    "Asia/Shanghai": "UTC+08:00",
    "Australia/Sydney": "UTC+10:00",
    "America/Toronto": "UTC-05:00",
    "Pacific/Honolulu": "UTC-10:00",
    "Asia/Dubai": "UTC+04:00",
    "Europe/Moscow": "UTC+03:00",
    "Asia/Kolkata": "UTC+05:30",
    "America/Sao_Paulo": "UTC-03:00",
    "Africa/Cairo": "UTC+02:00",
    "Pacific/Auckland": "UTC+12:00",
    "America/Mexico_City": "UTC-06:00",
};

const parseTimezoneOffset = (timezoneString) => {
    if (!timezoneString) return 0;

    const match = timezoneString.match(/UTC([+-])(\d{2}):(\d{2})/);
    if (!match) return 0;

    const sign = match[1] === "+" ? 1 : -1;
    const hours = parseInt(match[2], 10);
    const minutes = parseInt(match[3], 10);

    return sign * (hours + minutes / 60);
};

const getCurrentTimeInTimezone = (timezoneOffset) => {
    const now = new Date();

    const localTime = new Date(now.getTime() + timezoneOffset * 60 * 60 * 1000);

    return {
        hours: localTime.getUTCHours().toString().padStart(2, "0"),
        minutes: localTime.getUTCMinutes().toString().padStart(2, "0"),
        time: `${localTime
            .getUTCHours()
            .toString()
            .padStart(2, "0")}:${localTime
            .getUTCMinutes()
            .toString()
            .padStart(2, "0")}`,
    };
};

export { timezones, parseTimezoneOffset, getCurrentTimeInTimezone };
export default timezones;
