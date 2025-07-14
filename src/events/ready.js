import { Events } from "discord.js";
import { initializeGuildSettings } from "../queries.js";

export default {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Logged in as ${client.user.tag}`);

        console.log(
            `Checking settings for ${client.guilds.cache.size} guilds...`
        );

        for (const guild of client.guilds.cache.values()) {
            try {
                await initializeGuildSettings(guild.id);
                console.log(`Settings verified for: ${guild.name}`);
            } catch (error) {
                console.error(
                    `Failed to initialize settings for ${guild.name}:`,
                    error
                );
            }
        }

        console.log("Guild settings initialization complete!");
    },
};
