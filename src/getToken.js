import { config } from "dotenv";

const getToken = () => {
    config();
    const token = process.env.BIRTHDAY_BOT_TOKEN;

    if (!token) {
        throw new Error("BIRTHDAY_BOT_TOKEN environment variable is not set.");
    }

    return token;
};

// Used for command registration, located in /tools/

const globalRegistrationTokens = () => {
    const tokens = {
        botToken: getToken(),
        clientId: process.env.BIRTHDAY_BOT_CLIENT_ID,
    };

    if (!tokens.clientId) {
        throw new Error(
            "BIRTHDAY_BOT_CLIENT_ID environment variable is not set."
        );
    }

    return tokens;
};

const guildRegistrationTokens = () => {
    const tokens = {
        botToken: getToken(),
        clientId: process.env.BIRTHDAY_BOT_CLIENT_ID,
        guildId: process.env.BIRTHDAY_BOT_GUILD_ID,
    };

    if (!tokens.clientId) {
        throw new Error(
            "BIRTHDAY_BOT_CLIENT_ID environment variable is not set."
        );
    }

    if (!tokens.guildId) {
        throw new Error(
            "BIRTHDAY_BOT_GUILD_ID environment variable is not set."
        );
    }

    return tokens;
};

export { globalRegistrationTokens, guildRegistrationTokens };
export default getToken;
