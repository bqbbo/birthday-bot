import { config } from "dotenv";

const getToken = () => {
    config();
    const token = process.env.BIRTHDAY_BOT_TOKEN;

    if (!token) {
        throw new Error("BIRTHDAY_BOT_TOKEN environment variable is not set.");
    }

    return token;
};

export default getToken;
