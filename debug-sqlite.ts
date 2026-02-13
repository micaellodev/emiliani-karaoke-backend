import { Database } from "bun:sqlite";

try {
    const db = new Database("prisma/dev.db");

    // console.log("Querying table_sessions...");
    // const sessions = db.query("SELECT * FROM table_sessions").all();
    // console.log("Sessions:", sessions);

    console.log("Querying queue_items using prisma/dev.db...");
    const items = db.query("SELECT * FROM queue_items").all();
    console.log("Queue Count:", items.length);
} catch (error) {
    console.error("Error:", error);
}
