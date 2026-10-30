import Database from 'better-sqlite3';

const db = new Database('monitoringSuhudanKelembapan.db');
db.pragma('journal_mode = WAL');

// Buat tabel sensor_data jika belum ada
db.exec(`
  CREATE TABLE IF NOT EXISTS sensor_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    temperature REAL NOT NULL,
    humidity REAL NOT NULL,
    device_id TEXT DEFAULT 'ESP32_Wokwi',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;