import { executeQuery } from "./db/db.js";

const setBirthday = async (userId, birthday, birthTime) => {
    const query =
        "INSERT INTO birthdays (user_id, birthday, birth_time) VALUES (?, ?, ?)";
    const params = [userId, birthday, birthTime];

    try {
        await executeQuery(query, params);
    } catch (error) {
        console.error("Error setting birthday:", error);
        throw error;
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
        throw error;
    }
};

export { setBirthday, getBirthday };
