async function fetchLatestData() {
  try {
    const res = await fetch('/api/sensor/latest');
    const data = await res.json();

    if (data.temperature !== undefined) {
      document.getElementById('temp').innerText = data.temperature;
      document.getElementById('hum').innerText = data.humidity;
    }
  } catch (err) {
    console.error('Gagal mengambil data:', err);
  }
}

// Fetch data pertama kali dan set interval per 2 detik
fetchLatestData();
setInterval(fetchLatestData, 2000);