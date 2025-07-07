"use client";
import { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


export default function ImageUploader({ onUpload }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    // Get signature from backend
    const sigRes = await fetch("/api/sign-upload");
    const { timestamp, signature, apiKey, cloudName } = await sigRes.json();

    // Prepare form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    // Upload to Cloudinary
    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await cloudRes.json();
    setUploading(false);

    if (data.secure_url) {
      onUpload(data.secure_url);
    }
  };

  return (
    <div>
      {uploading ? (
        <p className="text-3xl text-gray-400 flex items-center gap-2">
            <AiOutlineLoading3Quarters className="animate-spin" />
          </p>
      ) : (
        <input type="file" accept="image/*" onChange={handleFileChange} />
      )}
    </div>
  );
}
