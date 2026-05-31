// components/DebugMenu.tsx
"use client";

export default function DebugMenu() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "red",
        color: "white",
        padding: "20px",
        textAlign: "center",
        fontSize: "24px",
        fontWeight: "bold",
        zIndex: 99999,
      }}
    >
      🔴 TESTMENY – SYNNS DEN? 🔴
    </div>
  );
}
