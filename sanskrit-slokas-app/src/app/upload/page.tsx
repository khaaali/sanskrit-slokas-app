"use client";
import React, { useState } from "react";
import { upload } from "@vercel/blob/client";

const DEITIES = ["Shiva", "Vishnu", "Ganapathi", "Shakti", "Skanda", "Aditya", "Other"];
const SCRIPTURES = ["Stotram", "Mantra", "Other"];

interface Transliteration {
  en: string;
  te: string;
}

interface Meaning {
  en: string;
  hi: string;
  te: string;
}

interface Sloka {
  originalText: string;
  transliteration: Transliteration;
  meaning: Meaning;
  audioFile: File | null;
  audioUrl: string;
  audioPreviewUrl?: string;
}

const emptySloka: Sloka = {
  originalText: "",
  transliteration: { en: "", te: "" },
  meaning: { en: "", hi: "", te: "" },
  audioFile: null,
  audioUrl: "",
  audioPreviewUrl: undefined,
};

export default function UploadPage() {
  const [deity, setDeity] = useState<string>("");
  const [customDeity, setCustomDeity] = useState<string>("");
  const [scripture, setScripture] = useState<string>("");
  const [customScripture, setCustomScripture] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [slokas, setSlokas] = useState<Sloka[]>([{ ...emptySloka }]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleSlokaChange = (
    idx: number,
    field: keyof Sloka,
    value: string,
    lang?: keyof Transliteration | keyof Meaning
  ) => {
    setSlokas((prev) => {
      const updated = [...prev];
      if (field === "transliteration" && lang) {
        updated[idx].transliteration[lang as keyof Transliteration] = value;
      } else if (field === "meaning" && lang) {
        updated[idx].meaning[lang as keyof Meaning] = value;
      } else if (field === "originalText") {
        updated[idx].originalText = value;
      }
      return updated;
    });
  };

  const handleAudioChange = (idx: number, file: File | null) => {
    setSlokas((prev) => {
      const updated = [...prev];
      updated[idx].audioFile = file;
      if (file) {
        updated[idx].audioPreviewUrl = URL.createObjectURL(file);
      } else {
        updated[idx].audioPreviewUrl = undefined;
      }
      return updated;
    });
  };

  const addSloka = () => setSlokas((prev) => [...prev, { ...emptySloka }]);
  const removeSloka = (idx: number) => setSlokas((prev) => prev.length === 1 ? prev : prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      // 1. Upload all audio files to Vercel Blob
      const slokasWithAudio = await Promise.all(
        slokas.map(async (sloka) => {
          let audioUrl = sloka.audioUrl;
          if (sloka.audioFile) {
            const file = sloka.audioFile;
            const uploadResult = await upload(file.name, file, { access: "public", handleUploadUrl: "/api/blob/upload" });
            audioUrl = uploadResult.url;
          }
          return {
            originalText: sloka.originalText,
            transliteration: sloka.transliteration,
            meaning: sloka.meaning,
            audioUrl
          };
        })
      );
      // 2. POST all data to API
      const res = await fetch("/api/upload-sloka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deities: [deity === "Other" ? customDeity : deity],
          scripture: scripture === "Other" ? customScripture : scripture,
          title,
          slokas: slokasWithAudio
        })
      });
      if (res.ok) {
        setMessage("Upload successful!");
        setDeity("");
        setCustomDeity("");
        setScripture("");
        setCustomScripture("");
        setTitle("");
        setSlokas([{ ...emptySloka }]);
      } else {
        const err = await res.json();
        setMessage("Error: " + (err.error || "Unknown error"));
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        setMessage("Error: " + (err as { message: string }).message);
      } else {
        setMessage("Error: Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Upload New Sloka Collection</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Title */}
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input type="text" className="w-full border p-2 rounded" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        {/* Deity and Scripture Row */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Deity Dropdown */}
          <div className="w-full md:w-1/2">
            <label className="block font-semibold mb-1">Deity</label>
            <select
              className="w-full border p-2 rounded mb-2"
              value={deity}
              onChange={e => setDeity(e.target.value)}
              required
            >
              <option value="">Select Deity</option>
              {DEITIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {deity === "Other" && (
              <input
                type="text"
                className="w-full border p-2 mt-2"
                placeholder="Enter custom deity"
                value={customDeity}
                onChange={e => setCustomDeity(e.target.value)}
                required
              />
            )}
          </div>
          {/* Scripture Dropdown */}
          <div className="w-full md:w-1/2">
            <label className="block font-semibold mb-1">Scripture</label>
            <select
              className="w-full border p-2 rounded mb-2"
              value={scripture}
              onChange={e => setScripture(e.target.value)}
              required
            >
              <option value="">Select Scripture</option>
              {SCRIPTURES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {scripture === "Other" && (
              <input
                type="text"
                className="w-full border p-2 mt-2"
                placeholder="Enter custom scripture"
                value={customScripture}
                onChange={e => setCustomScripture(e.target.value)}
                required
              />
            )}
          </div>
        </div>
        {/* Slokas Section */}
        <div>
          <label className="block font-semibold mb-2 text-lg">Slokas</label>
          {slokas.map((sloka, idx) => (
            <div key={idx} className="border-2 border-blue-200 rounded-lg p-6 mb-8 bg-blue-50 relative">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-blue-700 text-lg">Sloka {idx + 1}</span>
                <button type="button" className="text-red-500 font-semibold" onClick={() => removeSloka(idx)} disabled={slokas.length === 1}>Remove</button>
              </div>
              {/* Original Text */}
              <div className="mb-4">
                <label className="block font-semibold mb-1 text-blue-900">Original Text (Sanskrit)</label>
                <textarea className="w-full border p-3 rounded min-h-[80px] text-lg" value={sloka.originalText} onChange={e => handleSlokaChange(idx, "originalText", e.target.value)} required />
              </div>
              {/* Transliteration Section */}
              <div className="mb-4">
                <div className="font-semibold mb-1 text-blue-900">Transliteration</div>
                <div className="flex gap-4">
                  <textarea placeholder="English" className="border p-2 w-1/2 rounded min-h-[50px]" value={sloka.transliteration.en} onChange={e => handleSlokaChange(idx, "transliteration", e.target.value, "en")} required />
                  <textarea placeholder="Telugu" className="border p-2 w-1/2 rounded min-h-[50px]" value={sloka.transliteration.te} onChange={e => handleSlokaChange(idx, "transliteration", e.target.value, "te")} required />
                </div>
              </div>
              {/* Meaning Section */}
              <div className="mb-4">
                <div className="font-semibold mb-1 text-blue-900">Meaning</div>
                <div className="flex gap-4">
                  <textarea placeholder="English" className="border p-2 w-1/3 rounded min-h-[50px]" value={sloka.meaning.en} onChange={e => handleSlokaChange(idx, "meaning", e.target.value, "en")} required />
                  <textarea placeholder="Hindi" className="border p-2 w-1/3 rounded min-h-[50px]" value={sloka.meaning.hi} onChange={e => handleSlokaChange(idx, "meaning", e.target.value, "hi")} required />
                  <textarea placeholder="Telugu" className="border p-2 w-1/3 rounded min-h-[50px]" value={sloka.meaning.te} onChange={e => handleSlokaChange(idx, "meaning", e.target.value, "te")} required />
                </div>
              </div>
              {/* Audio Upload Section */}
              <div className="mb-2 p-4 bg-white border border-blue-200 rounded">
                <label className="block font-semibold mb-1 text-blue-900">Audio File</label>
                <input type="file" accept="audio/*" onChange={e => handleAudioChange(idx, e.target.files?.[0] || null)} required />
                {sloka.audioFile && (
                  <div className="mt-2 flex items-center gap-4">
                    <span className="text-sm text-gray-700">{sloka.audioFile.name}</span>
                    {sloka.audioPreviewUrl && (
                      <audio controls src={sloka.audioPreviewUrl} className="h-8" />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded font-semibold" onClick={addSloka}>Add Sloka</button>
        </div>
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded font-bold text-lg" disabled={loading}>{loading ? "Uploading..." : "Submit"}</button>
        {message && <div className="mt-4 text-center font-semibold text-lg">{message}</div>}
      </form>
    </div>
  );
} 