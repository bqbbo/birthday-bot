import { REST, Routes } from "discord.js";
import * as commands from "../src/commands/index.js";

import { globalRegistrationTokens } from "../src/getToken.js";

const tokens = globalRegistrationTokens();

const commandList = Object.values(commands);
const commandData = [];

for (const command of commandList) {
    if (command && "data" in command && "execute" in command) {
        commandData.push(command.data.toJSON());
    } else {
        console.log(
            `[WARNING] A command is missing a required "data" or "execute" property. It will not be registered.`
        );
    }
}

const rest = new REST().setToken(tokens.botToken);

try {
    console.log(
        `Started refreshing ${commandData.length} application (/) commands.`
    );

    const data = await rest.put(Routes.applicationCommands(tokens.clientId), {
        body: commandData,
    });

    console.log(
        `Successfully reloaded ${data.length} application (/) commands.`
    );
} catch (error) {
    console.error(error);
}
