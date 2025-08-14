"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";

export default function FileUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch uploaded images
  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/upload");
      const data = await res.json();
      setUploadedImages(data.images || []);
    } catch (error) {
      setMessage("Failed to fetch images.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;

    if (selectedFile && !selectedFile.type.startsWith("image/")) {
      setMessage("Please select a valid image file.");
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);
    setMessage("");

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("No file selected.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage("✅ File uploaded successfully!");
        setFile(null);
        setPreview(null);
        fetchImages(); // refresh uploaded images
      } else {
        const errorData = await res.json();
        setMessage(`❌ Upload failed: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      setMessage("❌ Upload failed due to network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-50">
      <h1 className="text-3xl font-semibold mb-6">📁 Upload Your Image</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md bg-white p-6 rounded shadow"
      >
        <label className="font-medium">Select Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="border p-2 rounded"
        />

        {preview && (
          <div className="w-32 h-32 border rounded overflow-hidden mx-auto">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
      )}

      <div className="w-full max-w-md mt-8">
        <h2 className="text-xl font-semibold mb-2">🖼️ Uploaded Images</h2>
        {loading && uploadedImages.length === 0 ? (
          <p>Loading images...</p>
        ) : uploadedImages.length === 0 ? (
          <p>No images uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {uploadedImages.map((img, index) => (
              <div
                key={index}
                className="w-24 h-24 border rounded overflow-hidden"
              >
                <img
                  src={`data:image/jpeg;base64,${img}`}
                  alt={`Uploaded ${index}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}