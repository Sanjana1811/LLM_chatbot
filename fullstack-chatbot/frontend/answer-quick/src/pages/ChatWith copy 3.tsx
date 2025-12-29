import { useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Send } from "lucide-react";
import { nanoid } from "nanoid";

type Message = {
  id: string;
  role: "user" | "bot";
  text: string;
};

const ChatWith: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);

  // TEXT → SPEECH
  const speak = (text: string) => {
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  // STOP SPEAKING
  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // COPY
  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // DELETE (LOCAL)
  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  // SHARE
  const shareMessage = async (text: string) => {
    if (navigator.share) {
      await navigator.share({ title: "Anahita AI", text });
    } else {
      copyMessage(text);
      alert("Copied to clipboard!");
    }
  };

  // SEND MESSAGE
  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: nanoid(), role: "user", text: input },
    ]);

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data: { reply: string } = await res.json();

      setMessages((prev) => [
        ...prev,
        { id: nanoid(), role: "bot", text: data.reply },
      ]);

      speak(data.reply);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nanoid(),
          role: "bot",
          text: "⚠️ Error connecting to server.",
        },
      ]);
    }

    setInput("");
    setLoading(false);
  };

  //  SPEECH → TEXT
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
      setInput(event.results[0][0].transcript);
    };
  };

  //  FILE UPLOAD
  const handleFile = async (file?: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setInput(data.text.slice(0, 2000));
  };

  return (
    <div style={styles.container}>
      <h2>Anahita 💬 AI Assistant</h2>
      <h6>Your friendly brain on demand</h6>

      <div style={styles.chatBox}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "#DCF8C6" : "#F1F0F0",
            }}
          >
            {/* {msg.text} */}
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p style={{ margin: "8px 0", lineHeight: "1.6", textAlign: "left" }}>
                    {children}
                  </p>
                ),
                li: ({ children }) => (
                  <li style={{ marginBottom: "6px", textAlign: "left" }}>
                    {children}
                  </li>
                ),
                h1: ({ children }) => (
                  <h1 style={{ textAlign: "left" }}>{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 style={{ textAlign: "left" }}>{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 style={{ textAlign: "left" }}>{children}</h3>
                ),
              }}
            >
              {msg.text}
            </ReactMarkdown>



            {/* msg.role === "bot" && */ (
              <div style={styles.actionRow}>
                <button
                  onClick={() => speak(msg.text)}
                  onDoubleClick={stopSpeaking}
                  title="Click to speak, double-click to stop"
                  style={styles.iconButton}
                >
                  {isSpeaking ? (
                    <i className="fa-solid fa-volume-xmark"></i>
                  ) : (
                    <i className="fa-solid fa-volume-high"></i>
                  )}
                </button>

                <button
                  onClick={() => copyMessage(msg.text)}
                  style={styles.iconButton}
                >
                  <i className="fa-solid fa-copy"></i>
                </button>

                <button
                  onClick={() => shareMessage(msg.text)}
                  style={styles.iconButton}
                >
                  <i className="fa-solid fa-share-nodes"></i>
                </button>

                <button
                  onClick={() => deleteMessage(msg.id)}
                  style={styles.iconButton}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
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

        <button onClick={startListening} style={styles.iconButton}>
          <i className="fa-solid fa-microphone"></i>
        </button>

        <input type="file" onChange={(e) => handleFile(e.target.files?.[0])} />

        <button onClick={sendMessage} style={styles.sendButton}>
          Send <Send size={18} />
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
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
  actionRow: {
    display: "flex",
    gap: "8px",
    marginTop: "6px",
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
  sendButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 16px",
    cursor: "pointer",
    border: "none",
    background: "#4CAF50",
    color: "#fff",
    borderRadius: "4px",
  },
  iconButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
  },
};

export default ChatWith;
