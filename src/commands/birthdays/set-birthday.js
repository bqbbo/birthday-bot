import { setBirthday } from "../../queries.js";
import { SlashCommandBuilder } from "discord.js";

const DAYS_IN_MONTHS = {
    1: 31,
    2: 29,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31,
};

const validateDay = (day, month) => {
    if (day < 1) {
        throw new Error("Day must be greater than 0.");
    }

    if (day > DAYS_IN_MONTHS[month]) {
        throw new Error(
            `Day must be less than or equal to ${DAYS_IN_MONTHS[month]} for the month ${month}.`
        );
    }
};

const validateYear = (year) => {
    if (year && (year < 1900 || year > new Date().getFullYear())) {
        throw new Error(
            "Year must be between 1900 and the current year. Shorthands are not supported."
        );
    }
};

const yieldSQLBirthdayString = (day, month, year) => {
    const formattedDay = day.toString().padStart(2, "0");
    const formattedMonth = month.toString().padStart(2, "0");

    if (year) {
        return `${year}-${formattedMonth}-${formattedDay}`;
    }

    return `1000-${formattedMonth}-${formattedDay}`;
};

export default {
    data: new SlashCommandBuilder()
        .setName("set-birthday")
        .setDescription("Sets your birthday.")
        .addIntegerOption((option) =>
            option
                .setName("month")
                .setDescription("The month of your birthday.")
                .setRequired(true)
                .addChoices(
                    {
                        name: "January",
                        value: 1,
                    },
                    {
                        name: "February",
                        value: 2,
                    },
                    {
                        name: "March",
                        value: 3,
                    },
                    {
                        name: "April",
                        value: 4,
                    },
                    {
                        name: "May",
                        value: 5,
                    },
                    {
                        name: "June",
                        value: 6,
                    },
                    {
                        name: "July",
                        value: 7,
                    },
                    {
                        name: "August",
                        value: 8,
                    },
                    {
                        name: "September",
                        value: 9,
                    },
                    {
                        name: "October",
                        value: 10,
                    },
                    {
                        name: "November",
                        value: 11,
                    },
                    {
                        name: "December",
                        value: 12,
                    }
                )
        )
        .addIntegerOption((option) =>
            option
                .setName("day")
                .setDescription("The day of your birthday.")
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option.setName("year").setDescription("The year of your birthday.")
        ),
    async execute(interaction) {
        const day = interaction.options.getInteger("day");
        const month = interaction.options.getInteger("month");
        const year = interaction.options.getInteger("year");

        try {
            validateDay(day, month);
        } catch (error) {
            await interaction.reply({
                content: error.message,
                ephemeral: true,
            });
            return;
        }

        if (year) {
            try {
                validateYear(year);
            } catch (error) {
                await interaction.reply({
                    content: error.message,
                    ephemeral: true,
                });
                return;
            }
        }

        await setBirthday(
            interaction.user.id,
            yieldSQLBirthdayString(day, month, year)
        );

        interaction.reply(
            `Your birthday has been registered for ${month}-${day}${
                year ? `-${year}` : ""
            }.`
        );
    },
};
