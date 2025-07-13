import { getBirthday } from "../../queries.js";
import { SlashCommandBuilder } from "discord.js";

export default {
    data: new SlashCommandBuilder()
        .setName("get-birthday")
        .setDescription("Retrieves a user's birthday.")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user whose birthday you want to retrieve.")
                .setRequired(true)
        ),
    async execute(interaction) {
        const targetUser = interaction.options.getUser("user");

        try {
            const birthdayData = await getBirthday(targetUser.id);

            if (!birthdayData) {
                await interaction.reply({
                    content: `${targetUser.username} has no birthday data.`,
                    ephemeral: true,
                });
                return;
            }

            const birthday = new Date(birthdayData.birthday);
            const formattedDate = birthday.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: birthday.getFullYear() === 1000 ? undefined : "numeric",
            });

            await interaction.reply(
                `${targetUser.username}'s birthday is ${formattedDate}.`
            );
        } catch (error) {
            console.error("Error getting birthday:", error);
            await interaction.reply({
                content: "There was an error retrieving the birthday.",
                ephemeral: true,
            });
        }
    },
};
