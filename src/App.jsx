import React, { useState } from "react";
import {
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Mail,
  MessageSquare,
  Megaphone,
  PlayCircle,
  Newspaper,
  Radio,
  Loader2,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";

const CHANNELS = [
  { key: "blog", label: "Blog Post", icon: Newspaper },
  { key: "linkedin_post", label: "LinkedIn Post", icon: Linkedin },
  { key: "twitter_thread", label: "X Thread", icon: Twitter },
  { key: "facebook_post", label: "Facebook Post", icon: Facebook },
  { key: "instagram_caption", label: "Instagram Caption", icon: Instagram },
  { key: "email", label: "Email", icon: Mail },
  { key: "sms", label: "SMS", icon: MessageSquare },
  { key: "google_ads", label: "Google Ads", icon: Megaphone },
  { key: "linkedin_ads", label: "LinkedIn Ads", icon: Megaphone },
  { key: "meta_ads", label: "Meta Ads", icon: Megaphone },
  { key: "educational", label: "Educational Script", icon: PlayCircle },
];

const DEFAULT_TARGETS = ["linkedin_post", "twitter_thread", "email", "sms"];

function timestamp() {
  return new Date()
    .toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .toUpperCase();
}

export default function App() {
  const [sourceChannel, setSourceChannel] = useState("blog");
  const [content, setContent] = useState("");
  const [signal, setSignal] = useState("");
  const [targets, setTargets] = useState(DEFAULT_TARGETS);
  const [outputs, setOutputs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState("");

  const toggleTarget = (key) => {
    setTargets((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const availableTargets = CHANNELS.filter((c) => c.key !== sourceChannel);

  const handleCopy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 1500);
  };

  const runRepurpose = async () => {
    setError("");
    if (!content.trim()) {
      setError("Paste the winning content piece first.");
      return;
    }
    if (targets.length === 0) {
      setError("Select at least one destination channel.");
      return;
    }

    setLoading(true);
    setOutputs(null);

    try {
      const response = await fetch("/api/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceChannel, content, signal, targets }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      setOutputs(data.result);
    } catch (e) {
      setError(
        "Couldn't generate repurposed content. Check that your API key is set up correctly, then try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
        background: "#F7F3EC",
        color: "#20232B",
        minHeight: "100vh",
        padding: "32px 20px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto 28px" }}>
        <div className="crs-mono" style={{ fontSize: 11, color: "#2F6F65", marginBottom: 6 }}>
          WIRE DESK // CONTENT REPURPOSING
        </div>
        <h1
          className="crs-serif"
          style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, margin: 0, lineHeight: 1.1 }}
        >
          One winning piece. Every channel it deserves.
        </h1>
        <p style={{ color: "#5B5749", fontSize: 15, marginTop: 8, maxWidth: 620 }}>
          Paste the content that's already proven to work. Pick where it should go next.
          The desk drafts channel-native versions, ready to review and send.
        </p>
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 380px) 1fr",
          gap: 24,
        }}
        className="crs-grid"
      >
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #CFC7B8",
            borderRadius: 4,
            padding: 20,
            height: "fit-content",
          }}
        >
          <label className="crs-mono" style={{ fontSize: 11, color: "#8A8371", display: "block", marginBottom: 6 }}>
            SOURCE CHANNEL
          </label>
          <select
            value={sourceChannel}
            onChange={(e) => setSourceChannel(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #CFC7B8",
              borderRadius: 3,
              background: "#F7F3EC",
              fontSize: 14,
              marginBottom: 16,
              fontFamily: "inherit",
            }}
          >
            {CHANNELS.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>

          <label className="crs-mono" style={{ fontSize: 11, color: "#8A8371", display: "block", marginBottom: 6 }}>
            WINNING CONTENT
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste the blog post, email, or post that's already performing well..."
            style={{
              width: "100%",
              minHeight: 160,
              padding: 12,
              border: "1px solid #CFC7B8",
              borderRadius: 3,
              fontSize: 13.5,
              lineHeight: 1.5,
              resize: "vertical",
              fontFamily: "inherit",
              background: "#F7F3EC",
              boxSizing: "border-box",
              marginBottom: 16,
            }}
          />

          <label className="crs-mono" style={{ fontSize: 11, color: "#8A8371", display: "block", marginBottom: 6 }}>
            WHY IT WORKED (optional)
          </label>
          <input
            value={signal}
            onChange={(e) => setSignal(e.target.value)}
            placeholder="e.g. highest CTR of the quarter"
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #CFC7B8",
              borderRadius: 3,
              fontSize: 13.5,
              fontFamily: "inherit",
              background: "#F7F3EC",
              boxSizing: "border-box",
              marginBottom: 18,
            }}
          />

          <label className="crs-mono" style={{ fontSize: 11, color: "#8A8371", display: "block", marginBottom: 8 }}>
            SEND TO
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
            {availableTargets.map((c) => {
              const Icon = c.icon;
              const active = targets.includes(c.key);
              return (
                <button
                  key={c.key}
                  onClick={() => toggleTarget(c.key)}
                  className={`crs-chip ${active ? "active" : ""}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 10px",
                    borderRadius: 20,
                    fontSize: 12.5,
                    fontWeight: 500,
                    border: "1px solid #CFC7B8",
                    background: active ? "#20232B" : "#FFFFFF",
                    color: active ? "#F7F3EC" : "#20232B",
                    cursor: "pointer",
                  }}
                >
                  <Icon size={13} />
                  {c.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={runRepurpose}
            disabled={loading}
            className="crs-run-btn"
            style={{
              width: "100%",
              padding: "12px 16px",
              border: "none",
              borderRadius: 3,
              background: "#D98E3B",
              color: "#20232B",
              fontWeight: 700,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="crs-spin" />
                Drafting...
              </>
            ) : (
              <>
                Repurpose Content <ArrowRight size={16} />
              </>
            )}
          </button>

          {error && <div style={{ marginTop: 12, fontSize: 12.5, color: "#B4472F" }}>{error}</div>}
        </div>

        <div>
          {!outputs && !loading && (
            <div
              style={{
                border: "1px dashed #CFC7B8",
                borderRadius: 4,
                padding: 40,
                textAlign: "center",
                color: "#8A8371",
                fontSize: 14,
              }}
            >
              <Radio size={22} style={{ marginBottom: 10, opacity: 0.6 }} />
              <div>Dispatches will appear here once you run the desk.</div>
            </div>
          )}

          {loading && (
            <div
              style={{
                border: "1px dashed #CFC7B8",
                borderRadius: 4,
                padding: 40,
                textAlign: "center",
                color: "#8A8371",
                fontSize: 14,
              }}
            >
              <Loader2 size={20} className="crs-spin" style={{ marginBottom: 10 }} />
              <div>
                Repurposing across {targets.length} channel{targets.length > 1 ? "s" : ""}...
              </div>
            </div>
          )}

          {outputs && (
            <div style={{ display: "grid", gap: 16 }}>
              {targets.map((key) => {
                const meta = CHANNELS.find((c) => c.key === key);
                const Icon = meta?.icon || Radio;
                const text = outputs[key] || "No output generated for this channel.";
                return (
                  <div key={key} className="crs-card" style={{ borderRadius: 4, padding: "18px 18px 16px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 12,
                        paddingBottom: 10,
                        borderBottom: "1px solid #EFEAE0",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Icon size={15} color="#2F6F65" />
                        <span className="crs-mono" style={{ fontSize: 11, color: "#2F6F65" }}>
                          TO: {meta?.label?.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span className="crs-mono" style={{ fontSize: 10, color: "#B4AC98" }}>
                          {timestamp()}
                        </span>
                        <button
                          onClick={() => handleCopy(key, text)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            padding: "4px 8px",
                            borderRadius: 3,
                            fontSize: 11,
                            color: "#5B5749",
                            background: "transparent",
                            border: "1px solid #CFC7B8",
                            cursor: "pointer",
                          }}
                        >
                          {copiedKey === key ? <Check size={12} /> : <Copy size={12} />}
                          {copiedKey === key ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                    <div style={{ whiteSpace: "pre-wrap", fontSize: 13.5, lineHeight: 1.6 }}>{text}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
