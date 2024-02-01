"use client";

import React from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Ping() {
  const ping = () => {
    fetch(apiUrl + "/api/test", {
      credentials: "include",
    });
  };
  return <button onClick={ping}>Ping</button>;
}
