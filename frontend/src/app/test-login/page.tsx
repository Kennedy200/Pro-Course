"use client";
import { useState } from "react";

export default function TestLogin() {
  const [result, setResult] = useState("");

  const testLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "lecturer@demo.com",
          password: "demo1234"
        }),
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setResult("Error: " + err.message);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Test Login</h1>
      <button onClick={testLogin} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Test Direct API Call
      </button>
      <pre style={{ marginTop: "20px", padding: "20px", backgroundColor: "#f5f5f5" }}>
        {result}
      </pre>
    </div>
  );
}