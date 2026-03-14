import { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [url, setUrl] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>Maum — 한국으로 마음을 전합니다</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@200;300&family=Noto+Sans+KR:wght@200;300&display=swap" rel="stylesheet" />
      </Head>
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
        color: "#1a1a1a",
      }}>
        <header style={{ padding: "36px 48px" }}>
          <span style={{ fontSize: "13px", fontWeight: 300, letterSpacing: "0.25em", textTransform: "uppercase" }}>
            Maum
          </span>
        </header>

        <main style={{
          flex: 1, display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center", padding: "0 48px 80px",
        }}>
          <div style={{ width: "100%", maxWidth: "640px" }}>
            {!submitted ? (
              <>
                <div style={{ textAlign: "center", marginBottom: "56px" }}>
                  <h1 style={{
                    fontFamily: "'Noto Serif KR', serif",
                    fontSize: "clamp(28px, 4vw, 44px)",
                    fontWeight: 200, marginBottom: "16px", lineHeight: 1.4,
                  }}>
                    한국으로 마음을 전합니다.
                  </h1>
                  <p style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "#999" }}>
                    Coupang Concierge Service
                  </p>
                </div>
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="쿠팡 상품 링크를 입력하세요"
                    style={{
                      width: "100%", border: "none", borderBottom: "1px solid #ccc",
                      outline: "none", padding: "14px 0", fontSize: "15px",
                      fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 300,
                      color: "#1a1a1a", background: "transparent",
                    }}
                  />
                  <button type="submit" disabled={loading} style={{
                    width: "100%", padding: "20px",
                    backgroundColor: loading ? "#555" : "#1a1a1a",
                    color: "#ffffff", border: "none", cursor: "pointer",
                    fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase",
                    transition: "background 0.2s",
                  }}>
                    {loading ? "Processing..." : "Check Price"}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: "#aaa", marginBottom: "24px" }}>
                  Received
                </p>
                <p style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 200, fontSize: "22px", lineHeight: 1.7 }}>
                  마음이 전달되고 있습니다.<br />곧 연락드리겠습니다.
                </p>
              </div>
            )}
          </div>
        </main>

        <footer style={{ padding: "28px 48px", display: "flex", justifyContent: "space-between", borderTop: "1px solid #f0f0f0" }}>
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#aaa" }}>Maum.space</div>
            <div style={{ fontSize: "10px", color: "#ccc", letterSpacing: "0.1em", marginTop: "4px" }}>© 2026 Maum Concierge</div>
          </div>
          <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
            <span style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#aaa" }}>How it works</span>
            <span style={{ color: "#ddd" }}>·</span>
            <span style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#aaa" }}>Privacy</span>
          </div>
        </footer>
      </div>
    </>
  );
}
