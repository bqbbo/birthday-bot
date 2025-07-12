import { SlashCommandBuilder } from "discord.js";

const DAYS_IN_MONTHS = {
    "01": 31,
    "02": 29,
    "03": 31,
    "04": 30,
    "05": 31,
    "06": 30,
    "07": 31,
    "08": 31,
    "09": 30,
    10: 31,
    11: 30,
    12: 31,
};

const validateDay = (day, month) => {
    if (day < 1 || day > DAYS_IN_MONTHS[month]) {
        throw new Error("Invalid day for the given month.");
    }
};

const validateYear = (year) => {
    if (year && (year < 1900 || year > new Date().getFullYear())) {
        throw new Error("Year must be between 1900 and the current year.");
    }
};

const yieldSQLBirthdayString = (day, month, year) => {
    const formattedDay = day.toString().padStart(2, "0");

    if (year) {
        return `${year}-${month}-${formattedDay}`;
    }

    return `1000-${month}-${formattedDay}`;
};

export default {
    data: new SlashCommandBuilder()
        .setName("set-birthday")
        .setDescription("Sets your birthday.")
        .addStringOption((option) =>
            option
                .setName("month")
                .setDescription("The month of your birthday.")
                .setRequired(true)
                .addChoices(
                    {
                        name: "January",
                        value: "01",
                    },
                    {
                        name: "February",
                        value: "02",
                    },
                    {
                        name: "March",
                        value: "03",
                    },
                    {
                        name: "April",
                        value: "04",
                    },
                    {
                        name: "May",
                        value: "05",
                    },
                    {
                        name: "June",
                        value: "06",
                    },
                    {
                        name: "July",
                        value: "07",
                    },
                    {
                        name: "August",
                        value: "08",
                    },
                    {
                        name: "September",
                        value: "09",
                    },
                    {
                        name: "October",
                        value: "10",
                    },
                    {
                        name: "November",
                        value: "11",
                    },
                    {
                        name: "December",
                        value: "12",
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
        try {
            validateDay(
                interaction.options.getString("day"),
                interaction.options.getString("month")
            );
        } catch {
            await interaction.reply({
                content: "Invalid date provided. Please check your input.",
                ephemeral: true,
            });
            return;
        }

        if (interaction.options.getInteger("year")) {
            try {
                validateYear(interaction.options.getInteger("year"));
            } catch {
                await interaction.reply({
                    content: `Invalid year provided. Please check your input.
                        Only formats such as 1990 or 2023 are allowed.`,
                    ephemeral: true,
                });
                return;
            }
        }

        console.log(
            yieldSQLBirthdayString(
                interaction.options.getInteger("day"),
                interaction.options.getString("month"),
                interaction.options.getInteger("year")
            )
        );
    },
};
