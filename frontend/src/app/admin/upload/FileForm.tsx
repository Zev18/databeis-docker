"use client";

import { Button } from "@/components/ui/button";
import { apiUrlClient } from "@/lib/consts";
import { useState } from "react";

export default function FileForm() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);

    fetch(apiUrlClient + "/api/sfarim/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    });
  };

  return (
    <div>
      <h2>Upload CSV File</h2>
      <input
        name="file"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
      />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}
