import mysql from "mysql2/promise";
import getDBToken from "./getDBToken.js";

let connection = null;

const connectToDatabase = async () => {
    if (connection) {
        return connection;
    }

    try {
        const dbConfig = getDBToken();

        connection = await mysql.createConnection({
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database,
            charset: dbConfig.charset,
        });

        console.log("Connected to MySQL database");
        return connection;
    } catch (error) {
        console.error("Error connecting to database:", error);
        throw error;
    }
};

const closeConnection = async () => {
    if (connection) {
        await connection.end();
        connection = null;
        console.log("Database connection closed");
    }
};

// Helper function to execute queries
const executeQuery = async (query, params = []) => {
    const conn = await connectToDatabase();
    try {
        const [rows] = await conn.execute(query, params);
        return rows;
    } catch (error) {
        console.error("Query execution error:", error);
        throw error;
    }
};

export { connectToDatabase, closeConnection, executeQuery };
export default connectToDatabase;
