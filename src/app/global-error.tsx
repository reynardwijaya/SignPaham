"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F6D9B4",
          fontFamily: "system-ui, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "9999px",
              backgroundColor: "rgba(97,23,21,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              fontSize: 32,
            }}
          >
            ⚠️
          </div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#3A2414",
              marginBottom: 12,
            }}
          >
            Terjadi Kesalahan Fatal
          </h1>
          <p style={{ fontSize: 14, color: "#7A6552", lineHeight: 1.6, marginBottom: 24 }}>
            Aplikasi mengalami masalah tak terduga. Silakan muat ulang halaman ini.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "12px 24px",
              borderRadius: "9999px",
              backgroundColor: "#3A2414",
              color: "#FBEEDD",
              fontWeight: 600,
              fontSize: 14,
              border: "none",
              cursor: "pointer",
            }}
          >
            Coba Lagi
          </button>
        </div>
      </body>
    </html>
  );
}
