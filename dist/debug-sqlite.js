"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bun_sqlite_1 = require("bun:sqlite");
try {
    const db = new bun_sqlite_1.Database("prisma/dev.db");
    console.log("Querying queue_items using prisma/dev.db...");
    const items = db.query("SELECT * FROM queue_items").all();
    console.log("Queue Count:", items.length);
}
catch (error) {
    console.error("Error:", error);
}
//# sourceMappingURL=debug-sqlite.js.map