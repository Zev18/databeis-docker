import React from "react";
import Login from "./Login";

export default function Header() {
  return (
    <header className="w-full p-5 flex justify-between items-center">
      <h1
        className="text-3xl font-bold"
        style={{ lineHeight: "10px", height: "10px" }}>
        Databeis
      </h1>
      <Login />
    </header>
  );
}
