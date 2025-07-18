const DBTokens = () => {
    const tokens = {
        host: process.env.BIRTHDAY_BOT_DATABASE_HOST || "127.0.0.1",
        port: process.env.BIRTHDAY_BOT_DATABASE_PORT || 3306,
        user: process.env.BIRTHDAY_BOT_DATABASE_USER || "root",
        password: process.env.BIRTHDAY_BOT_DATABASE_PASSWORD,
        database: process.env.BIRTHDAY_BOT_DATABASE_NAME,
        charset: process.env.BIRTHDAY_BOT_DATABASE_CHARSET || "utf8mb4",
    };

    if (!tokens.password) {
        throw new Error(
            "BIRTHDAY_BOT_DATABASE_PASSWORD environment variable is not set."
        );
    }

    if (!tokens.database) {
        throw new Error(
            "BIRTHDAY_BOT_DATABASE_NAME environment variable is not set."
        );
    }

    return tokens;
};

export default DBTokens;
