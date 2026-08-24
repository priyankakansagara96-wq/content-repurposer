import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Loader2, ArrowLeft } from "lucide-react";

export default function Dashboard({ onBack }) {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/runs")
      .then((res) => res.json())
      .then((data) => {
        setRuns(data.runs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalRuns = runs.length;

  const channelCounts = {};
  runs.forEach((run) => {
    (run.target_channels || []).forEach((ch) => {
      channelCounts[ch] = (channelCounts[ch] || 0) + 1;
    });
  });
  const chartData = Object.entries(channelCounts)
    .map(([channel, count]) => ({ channel, count }))
    .sort((a, b) => b.count - a.count);

  const topSourceChannel =
    Object.entries(
      runs.reduce((acc, r) => {
        acc[r.source_channel] = (acc[r.source_channel] || 0) + 1;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

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
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "transparent",
            border: "none",
            color: "#2F6F65",
            fontSize: 13,
            cursor: "pointer",
            marginBottom: 20,
            padding: 0,
          }}
        >
          <ArrowLeft size={14} /> Back to tool
        </button>

        <div className="crs-mono" style={{ fontSize: 11, color: "#2F6F65", marginBottom: 6 }}>
          WIRE DESK // DASHBOARD
        </div>
        <h1 className="crs-serif" style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 700, margin: "0 0 24px" }}>
          Content Library
        </h1>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "#8A8371" }}>
            <Loader2 size={20} className="crs-spin" style={{ marginBottom: 10 }} />
            <div>Loading runs...</div>
          </div>
        ) : (
          <>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Total Runs", value: totalRuns },
                { label: "Top Source Channel", value: topSourceChannel },
                { label: "Channels Used", value: Object.keys(channelCounts).length },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #CFC7B8",
                    borderRadius: 4,
                    padding: 16,
                  }}
                >
                  <div className="crs-mono" style={{ fontSize: 10, color: "#8A8371", marginBottom: 6 }}>
                    {stat.label.toUpperCase()}
                  </div>
                  <div className="crs-serif" style={{ fontSize: 24, fontWeight: 700 }}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            {chartData.length > 0 && (
              <div
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #CFC7B8",
                  borderRadius: 4,
                  padding: 20,
                  marginBottom: 28,
                }}
              >
                <div className="crs-mono" style={{ fontSize: 11, color: "#8A8371", marginBottom: 16 }}>
                  RUNS BY DESTINATION CHANNEL
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="channel" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#2F6F65" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Library table */}
            <div style={{ background: "#FFFFFF", border: "1px solid #CFC7B8", borderRadius: 4, overflow: "hidden" }}>
              <div className="crs-mono" style={{ fontSize: 11, color: "#8A8371", padding: "16px 20px 0" }}>
                RECENT RUNS
              </div>
              {runs.length === 0 ? (
                <div style={{ padding: 40, textAlign: "center", color: "#8A8371" }}>No runs yet.</div>
              ) : (
                runs.map((run) => (
                  <div
                    key={run.id}
                    style={{
                      padding: "14px 20px",
                      borderTop: "1px solid #EFEAE0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 2 }}>
                        {run.source_channel} → {(run.target_channels || []).join(", ")}
                      </div>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: "#8A8371",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {run.source_content?.slice(0, 90)}...
                      </div>
                    </div>
                    <div className="crs-mono" style={{ fontSize: 10, color: "#B4AC98", flexShrink: 0 }}>
                      {new Date(run.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}