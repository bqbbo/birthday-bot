import { getAllGuildSettings } from "./queries.js";
import { executeQuery } from "./db/db.js";
import {
    timezones,
    parseTimezoneOffset,
    getCurrentTimeInTimezone,
} from "./timezones.js";

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
            console.log(
                `Current time ${currentTime.time} does not match announcement time ${announcementTime} for guild ${guildId}`
            );
            return;
        }

        console.log(
            `Checking birthdays for guild ${guildId} at ${currentTime.time} (${timezoneKey})`
        );

        const birthdays = await getTodaysBirthdays();

        if (birthdays.length === 0) {
            console.log("No birthdays today globally");
            return;
        }

        const guild = client.guilds.cache.get(guildId);
        if (!guild) {
            console.log(`Guild ${guildId} not found in cache`);
            return;
        }

        const channel = guild.channels.cache.get(settings.channel_id);
        if (!channel) {
            console.log(
                `Channel ${settings.channel_id} not found in guild ${guild.name}`
            );
            return;
        }

        await guild.members.fetch();
        const guildMembers = guild.members.cache;

        const guildBirthdays = birthdays.filter((birthday) => {
            const isMember = guildMembers.has(birthday.user_id);
            if (isMember) {
                console.log(
                    `User ${birthday.user_id} is in guild ${guild.name} and has birthday today`
                );
            }
            return isMember;
        });

        if (guildBirthdays.length === 0) {
            console.log(
                `No guild members with birthdays today in ${guild.name}`
            );
            return;
        }

        console.log(
            `Found ${guildBirthdays.length} guild members with birthdays in ${guild.name}`
        );

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

                    console.log(
                        `Successfully fetched user: ${user.username}${
                            age ? ` (turning ${age})` : ""
                        }`
                    );
                }
            } catch (error) {
                console.error(
                    `Failed to fetch user ${birthday.user_id}:`,
                    error
                );
            }
        }

        if (birthdayUsersWithAges.length === 0) {
            console.log("No valid birthday users found");
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
        console.log(
            `Birthday announcement sent for guild ${guild.name} (${birthdayUsersWithAges.length} users) at ${currentTime.time} (${timezoneKey})`
        );
    } catch (error) {
        console.error(
            `Error announcing birthdays for guild ${guildId}:`,
            error
        );
    }
};

const checkBirthdays = async (client) => {
    try {
        console.log("Running birthday check...");
        const guilds = client.guilds.cache.keys();

        for (const guildId of guilds) {
            await announceBirthdaysForGuild(client, guildId);
        }
    } catch (error) {
        console.error("Error in birthday scheduler:", error);
    }
};

export { checkBirthdays, announceBirthdaysForGuild };
