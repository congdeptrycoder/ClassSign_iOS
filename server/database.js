'use strict';

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = '/Users/congchi/BTVN/App_MACOS/final/src/infrastructure/database/database.sqlite';

let db = null;

/**
 * Lấy singleton instance của kết nối SQLite.
 * @returns {import('better-sqlite3').Database}
 */
function getDb() {
    if (db) return db;

    if (!fs.existsSync(DB_PATH)) {
        throw new Error(`[DB] Không tìm thấy file database tại: ${DB_PATH}`);
    }

    try {
        db = new Database(DB_PATH, { readonly: false });
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
        console.log(`[DB] Đã kết nối SQLite: ${DB_PATH}`);
    } catch (err) {
        console.error('[DB] Lỗi kết nối SQLite:', err.message);
        throw err;
    }

    return db;
}

module.exports = { getDb };
