import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import db from './db.js';

const app = express();

app.use(cors());
app.use(express.json());
// Melayani file statis (index.html, style.css, app.js) dari folder public
app.use(express.static('public'));

// Endpoint API
app.get('/api/sensor', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM sensor_data ORDER BY id DESC LIMIT 100');
    res.json(stmt.all());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/sensor/latest', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM sensor_data ORDER BY id DESC LIMIT 1');
    res.json(stmt.get() || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/sensor', (req, res) => {
  try {
    const { temperature, humidity, device_id } = req.body;
    if (temperature === undefined || humidity === undefined) {
      return res.status(400).json({ error: 'temperature dan humidity wajib dikirim!' });
    }

    const stmt = db.prepare('INSERT INTO sensor_data (temperature, humidity, device_id) VALUES (?, ?, ?)');
    const result = stmt.run(temperature, humidity, device_id || 'ESP32_Wokwi');

    res.status(201).json({
      message: 'Data berhasil disimpan',
      id: result.lastInsertRowid,
      temperature,
      humidity
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});