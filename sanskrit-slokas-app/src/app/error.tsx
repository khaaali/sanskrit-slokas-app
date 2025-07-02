"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body style={{ fontFamily: 'sans-serif', padding: 40 }}>
        <h2>Something went wrong!</h2>
        <pre style={{ color: 'red', background: '#f9f9f9', padding: 16, borderRadius: 8 }}>{error.message}</pre>
        <button onClick={() => reset()} style={{ marginTop: 20, padding: '8px 16px', fontSize: 16 }}>Try again</button>
      </body>
    </html>
  );
} 