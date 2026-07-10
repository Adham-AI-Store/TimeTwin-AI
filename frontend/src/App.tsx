import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sendMessage } from "./services/chat";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  async function handleSend() {
    if (!message.trim()) return;

    setReply("Thinking...");

    try {
      const result = await sendMessage(message);
      console.log(result);

      setReply(result.response || result.error || "No response");
    } catch (err) {
      console.error(err);
      setReply("Error connecting to backend.");
    }
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>TimeTwin AI</h1>

      <textarea
        rows={6}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask me anything..."
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          borderRadius: "8px",
          marginBottom: "15px",
        }}
      />

      <button
        onClick={handleSend}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          borderRadius: "8px",
        }}
      >
        Send
      </button>

      <hr style={{ margin: "25px 0" }} />

      <h2>AI Response</h2>

      <div
  style={{
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    color: "#000000",
    minHeight: "200px",
    lineHeight: "1.7",
    overflowWrap: "break-word",
  }}
>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {reply}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default App;