import { Collection } from "discord.js";
import * as commands from "./commands/index.js";

const commandList = [...Object.values(commands)];

const loadCommands = (client) => {
    client.commands = new Collection();

    commandList.forEach((command) => {
        if (command.data && command.execute) {
            client.commands.set(command.data.name, command);
        } else {
            console.warn(
                `Command ${
                    command.data?.name || "unknown"
                } is missing data or execute function.\nThe command will not be loaded!`
            );
        }
    });
};

export default loadCommands;
