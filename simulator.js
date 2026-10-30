import db from './db.js';

function simulateData() {
  const temp = parseFloat((20 + Math.random() * 15).toFixed(1)); // 20.0 - 35.0 °C
  const hum = parseFloat((40 + Math.random() * 40).toFixed(1));  // 40.0 - 80.0 %

  const stmt = db.prepare('INSERT INTO sensor_data (temperature, humidity, device_id) VALUES (?, ?, ?)');
  stmt.run(temp, hum, 'Simulator_Test');

  console.log(`[Simulator] Data terkirim: Suhu=${temp}°C, Kelembapan=${hum}%`);
}

// Jalankan simulasi setiap 3 detik
setInterval(simulateData, 3000);