import { useState, useEffect } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const API_URL = "http://localhost:5000/api/items";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setItems(data);
    } catch (err) {
      console.error("Gagal mengambil data dari database:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (isEditing) {
      try {
        const response = await fetch(`${API_URL}/${currentId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: inputText }),
        });
        
        if (response.ok) {
          setItems(
            items.map((item) =>
              item.id === currentId ? { ...item, text: inputText } : item
            )
          );
          setIsEditing(false);
          setCurrentId(null);
        }
      } catch (err) {
        console.error("Gagal memperbarui data:", err);
      }
    } else {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: inputText }),
        });
        
        if (response.ok) {
          const newData = await response.json();
          const itemBaru = Array.isArray(newData) ? newData[0] : newData;
          setItems([...items, itemBaru]);
        }
      } catch (err) {
        console.error("Gagal menambah data:", err);
      }
    }
    setInputText("");
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentId(item.id);
    setInputText(item.text);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setItems(items.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Gagal menghapus data:", err);
    }
  };

  // Objek Style untuk tampilan UI yang lebih modern
  const styles = {
    container: {
      maxWidth: "550px",
      margin: "60px auto",
      padding: "30px",
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
      color: "#333333",
    },
    header: {
      textAlign: "center",
      marginBottom: "25px",
      color: "#1e293b",
      fontWeight: "700",
      fontSize: "24px",
    },
    form: {
      display: "flex",
      gap: "10px",
      marginBottom: "25px",
    },
    input: {
      flex: 1,
      padding: "12px 16px",
      fontSize: "15px",
      border: "2px solid #e2e8f0",
      borderRadius: "10px",
      outline: "none",
      transition: "border-color 0.2s ease-in-out",
    },
    buttonSubmit: {
      padding: "12px 24px",
      fontSize: "15px",
      fontWeight: "600",
      backgroundColor: isEditing ? "#3b82f6" : "#10b981",
      color: "white",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    buttonCancel: {
      padding: "12px 16px",
      fontSize: "15px",
      backgroundColor: "#f1f5f9",
      color: "#64748b",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
    },
    list: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    listItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px",
      backgroundColor: "#f8fafc",
      borderRadius: "10px",
      marginBottom: "12px",
      border: "1px solid #edf2f7",
      transition: "transform 0.2s, box-shadow 0.2s",
    },
    itemText: {
      fontSize: "16px",
      color: "#334155",
      lineHeight: "1.5",
    },
    actionGroup: {
      display: "flex",
      gap: "8px",
    },
    buttonEdit: {
      backgroundColor: "#fef3c7",
      color: "#d97706",
      border: "none",
      padding: "8px 14px",
      borderRadius: "6px",
      fontWeight: "600",
      cursor: "pointer",
    },
    buttonDelete: {
      backgroundColor: "#fee2e2",
      color: "#dc2626",
      border: "none",
      padding: "8px 14px",
      borderRadius: "6px",
      fontWeight: "600",
      cursor: "pointer",
    },
    emptyState: {
      textAlign: "center",
      color: "#94a3b8",
      marginTop: "20px",
      fontStyle: "italic",
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>✨ Tugas Saya</h2>

      {/* FORM INPUT */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Apa yang ingin Anda kerjakan hari ini?"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={styles.input}
          onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />
        <button type="submit" style={styles.buttonSubmit}>
          {isEditing ? "Simpan" : "Tambah"}
        </button>
        {isEditing && (
          <button 
            type="button" 
            onClick={() => { setIsEditing(false); setInputText(""); }}
            style={styles.buttonCancel}
          >
            Batal
          </button>
        )}
      </form>

      {/* LIST DATA */}
      <ul style={styles.list}>
        {items.map((item) => (
          <li key={item.id} style={styles.listItem}>
            <span style={styles.itemText}>{item.text}</span>
            <div style={styles.actionGroup}>
              <button onClick={() => handleEdit(item)} style={styles.buttonEdit}>
                Edit
              </button>
              <button onClick={() => handleDelete(item.id)} style={styles.buttonDelete}>
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
      {items.length === 0 && <p style={styles.emptyState}>Belum ada tugas. Ketik sesuatu di atas!</p>}
    </div>
  );
}

export default App;
