import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import '../assets/css/ChatWith.css';
import { Send } from "lucide-react";


type Message = {
  role: "user" | "bot";
  text: string;
};

const ChatWith: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 🔊 TEXT → SPEECH FUNCTION (ADD HERE)
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.cancel(); // stop previous speech
    speechSynthesis.speak(utterance);
  };
  // const speak = (text: string) => {
  //   const utterance = new SpeechSynthesisUtterance(text);
  //   speechSynthesis.speak(utterance);
  // };

  const sendMessage = async (): Promise<void> => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data: { reply: string } = await res.json();

      // Add bot reply
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.reply },
      ]);

      // 🔊 SPEAK BOT RESPONSE
      // Auto-speak bot reply
      speak(data.reply);

    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error connecting to server." },
      ]);
    }

    setInput("");
    setLoading(false);
  };

  // Handle file upload
  const handleFile = async (file?: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    // Send extracted text to chat
    setInput(data.text.slice(0, 2000));
  };

  // Dictation feature or voice input
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
  };


  return (
    <div style={styles.container}>
      <h2>Anahita 💬 AI Assistant</h2>
      <h6>Your friendly brain on demand</h6>

      <div style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "#DCF8C6" : "#F1F0F0",
            }}
          >
            {msg.text}
            {/* 🔊 SPEAKER BUTTON (BOT ONLY) */}
            {msg.role === "bot" && (
              <button
                onClick={() => speak(msg.text)}
                style={styles.speakerBtn}
              >
                🔊
              </button>
            )}
          </div>
        ))}
        {loading && <div style={styles.typing}>Bot is typing...</div>}
      </div>

      <div style={styles.inputRow}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button onClick={startListening} style={styles.micButton}>
          <i className="fa fa-microphone"></i>
        </button>

        <input
          type="file"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {/* <button onClick={sendMessage} style={styles.iconButton}>
          <i className="fa fa-send-o" style={{ fontSize: "24px" }}></i>
        </button> */}

        <button onClick={sendMessage} style={styles.button}>
          Send <Send size={20} />
        </button>


      </div>
    </div>
  );
};

type Styles = {
  [key: string]: React.CSSProperties;
};

const styles: Styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    fontFamily: "Arial, sans-serif",
  },
  chatBox: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "10px",
    height: "400px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  message: {
    padding: "8px 12px",
    borderRadius: "10px",
    maxWidth: "80%",
  },
  typing: {
    fontStyle: "italic",
    color: "gray",
  },
  inputRow: {
    display: "flex",
    marginTop: "10px",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
  },
  button: {
    padding: "10px 16px",
    cursor: "pointer",
    background: "transparent",
    border: "none",
  },
  micButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#333",
    fontSize: "20px",
  },
  sendButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    cursor: "pointer",
  },
  iconButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
  }

};

export default ChatWith;
