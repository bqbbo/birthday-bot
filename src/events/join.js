import { Events } from "discord.js";
import { initializeGuildSettings } from "../queries.js";

export default {
    name: Events.GuildCreate,
    async execute(guild) {
        console.log(`Joined new guild: ${guild.name} (ID: ${guild.id})`);

        try {
            await initializeGuildSettings(guild.id);
            console.log(`Initialized settings for guild: ${guild.name}`);
        } catch (error) {
            console.error(
                `Failed to initialize settings for guild ${guild.name}:`,
                error
            );
        }
    },
};
