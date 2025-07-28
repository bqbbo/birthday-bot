import { getAllGuildSettings } from "./queries.js";
import { executeQuery } from "./db/db.js";
import {
    timezones,
    parseTimezoneOffset,
    getCurrentTimeInTimezone,
} from "./timezones.js";

const verifySecondSync = () => {
    const currentTime = new Date();
    const seconds = currentTime.getSeconds();

    if (seconds !== 0) {
        return false;
    }

    return true;
};

const calculateAge = (birthdayDate) => {
    const currentYear = new Date().getFullYear();
    const birthYear = birthdayDate.getFullYear();

    if (birthYear === 1000) {
        return null;
    }

    return currentYear - birthYear;
};

const getTodaysBirthdays = async () => {
    const query = `
        SELECT user_id, birthday
        FROM birthdays
        WHERE DATE_FORMAT(birthday, '%m-%d') = DATE_FORMAT(CURDATE(), '%m-%d')
    `;

    try {
        const result = await executeQuery(query);
        return result;
    } catch (error) {
        console.error("Error fetching today's birthdays:", error);
        return [];
    }
};

const announceBirthdaysForGuild = async (client, guildId) => {
    try {
        const settings = await getAllGuildSettings(guildId);

        if (!settings.channel_id) {
            console.log(`No announcement channel set for guild ${guildId}`);
            return;
        }

        const timezoneKey = settings.timezone || "UTC";
        const timezoneValue = timezones[timezoneKey] || "UTC+00:00";
        const timezoneOffset = parseTimezoneOffset(timezoneValue);

        const announcementTime = settings.announcement_time || "09:00";
        const birthdayMessage =
            settings.birthday_message || "Happy birthday, {users}! 🎉";

        const currentTime = getCurrentTimeInTimezone(timezoneOffset);

        if (currentTime.time !== announcementTime) {
            return;
        }

        const birthdays = await getTodaysBirthdays();

        if (birthdays.length === 0) {
            console.log("No birthdays today globally");
            return;
        }

        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            console.log(
                `Guild ${guildId} not found in cache. Restarting the bot may be necessary.`
            );
            return;
        }

        const channel = guild.channels.cache.get(settings.channel_id);
        if (!channel) {
            return;
        }

        await guild.members.fetch();
        const guildMembers = guild.members.cache;

        const guildBirthdays = birthdays.filter((birthday) => {
            return guildMembers.has(birthday.user_id);
        });

        if (guildBirthdays.length === 0) {
            return;
        }

        const birthdayUsersWithAges = [];
        for (const birthday of guildBirthdays) {
            try {
                const user = await client.users.fetch(birthday.user_id);
                if (user) {
                    const birthdayDate = new Date(birthday.birthday);
                    const age = calculateAge(birthdayDate);

                    birthdayUsersWithAges.push({
                        user,
                        age,
                    });
                }
            } catch (error) {
                console.error(
                    `Failed to fetch user ${birthday.user_id}:`,
                    error
                );
            }
        }

        if (birthdayUsersWithAges.length === 0) {
            return;
        }

        const userMentions = birthdayUsersWithAges
            .map(({ user, age }) => {
                if (age !== null) {
                    return `<@${user.id}> (turning ${age}!)`;
                } else {
                    return `<@${user.id}>`;
                }
            })
            .join(", ");

        let message = birthdayMessage;
        message = message.replace("{users}", userMentions);

        if (settings.ping_role_id) {
            message = `<@&${settings.ping_role_id}> ${message}`;
        }

        await channel.send(message);
    } catch (error) {
        console.error(
            `Error announcing birthdays for guild ${guildId}:`,
            error
        );
    }
};

const checkBirthdays = async (client) => {
    if (!verifySecondSync()) {
        return;
    }

    try {
        const guilds = client.guilds.cache.keys();

        for (const guildId of guilds) {
            await announceBirthdaysForGuild(client, guildId);
        }
    } catch (error) {
        console.error("Error in birthday scheduler:", error);
    }
};

export { checkBirthdays, announceBirthdaysForGuild };
