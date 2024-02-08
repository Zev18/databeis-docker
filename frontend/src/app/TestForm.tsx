"use client";

import { FormEvent, useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function TestForm() {
  const [file, setFile] = useState<File>();

  const saveFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = new FormData();
    if (!file) return;
    body.append("file", file);
    try {
      await fetch(apiUrl + "/api/upload", {
        method: "POST",
        body,
        credentials: "include",
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={submitForm} className="flex flex-col gap-4">
        <label htmlFor="file">Upload file</label>
        <input
          type="file"
          name="file"
          id="file"
          accept=".csv"
          onChange={saveFile}
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
