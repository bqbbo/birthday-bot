import { executeQuery } from "./db/db.js";

const createBirthdayTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS birthdays (
            user_id VARCHAR(255) NOT NULL,
            birthday DATE NOT NULL,
            PRIMARY KEY (user_id)
        );
    `;

    await executeQuery(query);

    console.log("Birthday table verified.");
};

const setBirthday = async (userId, birthday) => {
    const query = `
        INSERT INTO birthdays (user_id, birthday)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE birthday = VALUES(birthday)
    `;
    const params = [userId, birthday];

    try {
        await executeQuery(query, params);
    } catch (error) {
        console.error("Error setting birthday:", error);
    }
};

const getBirthday = async (userId) => {
    const query = "SELECT * FROM birthdays WHERE user_id = ?";
    const params = [userId];

    try {
        const result = await executeQuery(query, params);
        return result.length > 0 ? result[0] : null;
    } catch (error) {
        console.error("Error fetching birthday:", error);
    }
};

export { createBirthdayTable, setBirthday, getBirthday };
