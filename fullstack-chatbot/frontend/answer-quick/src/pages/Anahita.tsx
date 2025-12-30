import { useState, useEffect } from "react";
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

  // 🔊 Speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  /* ----------------------------------
     LOAD AVAILABLE VOICES (IMPORTANT)
  -----------------------------------*/
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  /* ----------------------------------
     TEXT → SPEECH (FEMALE VOICE)
  -----------------------------------*/
  const speak = (text: string) => {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Anahita's voice
    const femaleVoice =
      voices.find(v => v.name.includes("Google UK English Female")) ||
      voices.find(v => v.name.includes("Microsoft Zira")) ||
      voices.find(v => v.name.toLowerCase().includes("female")) ||
      voices.find(v => v.name.toLowerCase().includes("woman"));

    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.lang = "en-US";
    utterance.pitch = 1.2; // slightly higher → feminine
    utterance.rate = 1;    // natural speed

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const shareMessage = async (text: string) => {
    if (navigator.share) {
      await navigator.share({ title: "Anahita AI", text });
    } else {
      copyMessage(text);
      alert("Copied to clipboard!");
    }
  };

  /* ----------------------------------
     SEND MESSAGE
  -----------------------------------*/
  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages(prev => [
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

      setMessages(prev => [
        ...prev,
        { id: nanoid(), role: "bot", text: data.reply },
      ]);

      speak(data.reply);
    } catch {
      setMessages(prev => [
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

  /* ----------------------------------
     SPEECH → TEXT
  -----------------------------------*/
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

  return (
    <div style={styles.container}>
      <h2>Anahita 💬 AI Assistant</h2>
      <h6>Your friendly brain on demand</h6>

      <div style={styles.chatBox}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              ...styles.message,
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "#DCF8C6" : "#F1F0F0",
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}
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

            <div style={styles.actionRow}>
              <button
                onClick={() => speak(msg.text)}
                onDoubleClick={stopSpeaking}
                style={styles.iconButton}
              >
                <i className={`fa-solid ${isSpeaking ? "fa-volume-xmark" : "fa-volume-high"}`} />
              </button>

              <button onClick={() => copyMessage(msg.text)} style={styles.iconButton}>
                <i className="fa-solid fa-copy" />
              </button>

              <button onClick={() => shareMessage(msg.text)} style={styles.iconButton}>
                <i className="fa-solid fa-share-nodes" />
              </button>

              <button onClick={() => deleteMessage(msg.id)} style={styles.iconButton}>
                <i className="fa-solid fa-trash" />
              </button>
            </div>
          </div>
        ))}

        {loading && <div style={styles.typing}>Anahita is thinking…</div>}
      </div>

      <div style={styles.inputRow}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
        />

        <button onClick={startListening} style={styles.iconButton}>
          <i className="fa-solid fa-microphone" />
        </button>

        <button onClick={sendMessage} style={styles.sendButton}>
          Send <Send size={18} />
        </button>
      </div>
    </div>
  );
};

/* ----------------------------------
   STYLES
-----------------------------------*/
const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: "600px", margin: "40px auto", fontFamily: "Arial" },
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
  message: { padding: "8px 12px", borderRadius: "10px", maxWidth: "80%" },
  actionRow: { display: "flex", gap: "8px", marginTop: "6px" },
  typing: { fontStyle: "italic", color: "gray" },
  inputRow: { display: "flex", marginTop: "10px", gap: "10px" },
  input: { flex: 1, padding: "10px" },
  sendButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 16px",
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  iconButton: { background: "transparent", border: "none", cursor: "pointer" },
};

export default ChatWith;


// Ebony
// #3d393b

// Orchid
// #7e1e80

// Purple
// #9505e3

// // Violet
// #b637fb


// OR
// primary color scheme: emerald green (Primary Button)
    // #10B981 - emerald green
    // #059669 - dark emerald green
    // #047857 - darker emerald green
    // #065f46 - darkest emerald green

    // Secondary color scheme: violet purple (Secondary Button)
    // border : #6EE7B7(mint)

    //Disabled button: gray
    // #9CA3AF - gray
    // #6B7280 - dark gray
    // #4B5563 - darker gray
    // #374151 - darkest gray

    // background: #D1D5DB - light gray background
    // text: #9CA3AF - muted gray
    





//     Fresh & Minimal Theme Mapping

// 🔘 Buttons
// - Primary button:  
//   - Background: #10B981 (emerald green)  
//   - Text: White (#FFFFFF)  
//   - Hover: Darker emerald (#059669)  
// - Secondary button:  
//   - Border: #6EE7B7 (mint)  
//   - Text: #10B981 (emerald)  
//   - Hover: Mint background with emerald text  
// - Disabled button:  
//   - Background: #D1D5DB (light gray)  
//   - Text: #9CA3AF (muted gray)  

// ---

// 📇 Cards
// - Background: White (#FFFFFF)  
// - Border: Subtle mint (#6EE7B7) or light gray (#E5E7EB)  
// - Title text: Ebony/dark gray (#374151)  
// - Accent elements (icons, highlights): Amber (#F59E0B)  

// ---

// 🪟 Modals & Pop‑ups
// - Surface: White (#FFFFFF)  
// - Header bar: Emerald (#10B981) with white text  
// - Overlay: Semi‑transparent black (rgba(0,0,0,0.4))  
// - Close button: Muted gray (#6B7280) hover → amber (#F59E0B)  

// ---

// 🎠 Carousels
// - Active indicator: Emerald (#10B981)  
// - Inactive indicator: Muted gray (#9CA3AF)  
// - Card inside carousel: White background, mint border, amber accent for active state  

// ---

// 🎛 Icons
// - Default: Dark gray (#374151)  
// - Active: Emerald (#10B981)  
// - Alert/notification: Amber (#F59E0B)  

// ---

// 🖋 Typography
// - Font family: Inter / Roboto / SF Pro  
// - Sizes:  
//   - Headings: 20–24px, bold, ebony/dark gray  
//   - Body text: 16–18px, regular, dark gray  
//   - Labels/placeholders: 14px, muted gray (#6B7280)  

// ---

// ✨ Design Notes
// - Emerald is your trustworthy action color → use it for CTAs and headers.  
// - Mint is your soft secondary → use it for borders, hover states, and subtle highlights.  
// - Amber is your attention grabber → use sparingly for alerts, badges, or highlights.  
// - Keep backgrounds light (white or very light gray) so the green tones feel fresh and minimal.
