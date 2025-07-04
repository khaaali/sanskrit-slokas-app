"use client";
import React, { useState, useEffect } from "react";
import React, { useState, useEffect } from "react";
import { upload } from "@vercel/blob/client";
import { ErrorBoundary } from './ErrorBoundary';
import { ErrorBoundary } from './ErrorBoundary';

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

function UploadPage() {
function UploadPage() {
  const [deity, setDeity] = useState<string>("");
  const [customDeity, setCustomDeity] = useState<string>("");
  const [scripture, setScripture] = useState<string>("");
  const [customScripture, setCustomScripture] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [slokas, setSlokas] = useState<Sloka[]>([{ ...emptySloka }]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [slokaLoading, setSlokaLoading] = useState<boolean[]>([false]);
  const [slokaError, setSlokaError] = useState<string[]>([""]);
  const [slokaLoading, setSlokaLoading] = useState<boolean[]>([false]);
  const [slokaError, setSlokaError] = useState<string[]>([""]);

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

  const handleSlokaOriginalBlur = async (idx: number) => {
    const text = slokas[idx].originalText;
    if (!text.trim()) return;
    setSlokaLoading((prev) => {
      const arr = [...prev];
      arr[idx] = true;
      return arr;
    });
    setSlokaError((prev) => {
      const arr = [...prev];
      arr[idx] = "";
      return arr;
    });
    try {
      const res = await fetch("/api/generate-sloka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sanskritText: text }),
      });
      const data = await res.json();
      if (data.result) {
        let parsed;
        try {
          let aiText = data.result.trim();
          // Remove Markdown code block if present
          if (aiText.startsWith('```json')) {
            aiText = aiText.replace(/^```json/, '').replace(/```$/, '').trim();
          } else if (aiText.startsWith('```')) {
            aiText = aiText.replace(/^```/, '').replace(/```$/, '').trim();
          }
          parsed = JSON.parse(aiText);
        } catch {
          setSlokaError((prev) => {
            const arr = [...prev];
            arr[idx] = "AI response could not be parsed.";
            return arr;
          });
          setSlokaLoading((prev) => {
            const arr = [...prev];
            arr[idx] = false;
            return arr;
          });
          return;
        }
        setSlokas((prev) => {
          const updated = [...prev];
          updated[idx].transliteration.en = parsed.transliteration?.english || "";
          updated[idx].transliteration.te = parsed.transliteration?.telugu || "";
          updated[idx].meaning.en = parsed.meaning?.english || "";
          updated[idx].meaning.hi = parsed.meaning?.hindi || "";
          updated[idx].meaning.te = parsed.meaning?.telugu || "";
          return updated;
        });
      } else {
        setSlokaError((prev) => {
          const arr = [...prev];
          arr[idx] = data.error || "Unknown error";
          return arr;
        });
      }
    } catch {
      setSlokaError((prev) => {
        const arr = [...prev];
        arr[idx] = "Failed to call API";
        return arr;
      });
    }
    setSlokaLoading((prev) => {
      const arr = [...prev];
      arr[idx] = false;
      return arr;
    });
  };

  const handleSlokaOriginalBlur = async (idx: number) => {
    const text = slokas[idx].originalText;
    if (!text.trim()) return;
    setSlokaLoading((prev) => {
      const arr = [...prev];
      arr[idx] = true;
      return arr;
    });
    setSlokaError((prev) => {
      const arr = [...prev];
      arr[idx] = "";
      return arr;
    });
    try {
      const res = await fetch("/api/generate-sloka", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sanskritText: text }),
      });
      const data = await res.json();
      if (data.result) {
        let parsed;
        try {
          let aiText = data.result.trim();
          // Remove Markdown code block if present
          if (aiText.startsWith('```json')) {
            aiText = aiText.replace(/^```json/, '').replace(/```$/, '').trim();
          } else if (aiText.startsWith('```')) {
            aiText = aiText.replace(/^```/, '').replace(/```$/, '').trim();
          }
          parsed = JSON.parse(aiText);
        } catch {
          setSlokaError((prev) => {
            const arr = [...prev];
            arr[idx] = "AI response could not be parsed.";
            return arr;
          });
          setSlokaLoading((prev) => {
            const arr = [...prev];
            arr[idx] = false;
            return arr;
          });
          return;
        }
        setSlokas((prev) => {
          const updated = [...prev];
          updated[idx].transliteration.en = parsed.transliteration?.english || "";
          updated[idx].transliteration.te = parsed.transliteration?.telugu || "";
          updated[idx].meaning.en = parsed.meaning?.english || "";
          updated[idx].meaning.hi = parsed.meaning?.hindi || "";
          updated[idx].meaning.te = parsed.meaning?.telugu || "";
          return updated;
        });
      } else {
        setSlokaError((prev) => {
          const arr = [...prev];
          arr[idx] = data.error || "Unknown error";
          return arr;
        });
      }
    } catch {
      setSlokaError((prev) => {
        const arr = [...prev];
        arr[idx] = "Failed to call API";
        return arr;
      });
    }
    setSlokaLoading((prev) => {
      const arr = [...prev];
      arr[idx] = false;
      return arr;
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

  const addSloka = () => {
    setSlokas((prev) => [
      ...prev,
      { ...emptySloka } // Always add a fresh, empty sloka
    ]);
    setSlokaLoading((prev) => [...prev, false]);
    setSlokaError((prev) => [...prev, ""]);
  };
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
        setSlokaError([""]);
        setSlokaLoading([false]);
      } else {
        const err = await res.json();
        setMessage("Error: " + (err.error || "Unknown error"));
      }
    } catch (_err) {
      if (_err && typeof _err === 'object' && 'message' in _err) {
        setMessage("Error: " + (_err as { message: string }).message);
    } catch (_err) {
      if (_err && typeof _err === 'object' && 'message' in _err) {
        setMessage("Error: " + (_err as { message: string }).message);
      } else {
        setMessage("Error: Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Update slokaLoading and slokaError arrays when slokas are added/removed
  useEffect(() => {
    setSlokaLoading((prev) => {
      const arr = [...prev];
      while (arr.length < slokas.length) arr.push(false);
      while (arr.length > slokas.length) arr.pop();
      return arr;
    });
    setSlokaError((prev) => {
      const arr = [...prev];
      while (arr.length < slokas.length) arr.push("");
      while (arr.length > slokas.length) arr.pop();
      return arr;
    });
  }, [slokas.length]);

  // Update slokaLoading and slokaError arrays when slokas are added/removed
  useEffect(() => {
    setSlokaLoading((prev) => {
      const arr = [...prev];
      while (arr.length < slokas.length) arr.push(false);
      while (arr.length > slokas.length) arr.pop();
      return arr;
    });
    setSlokaError((prev) => {
      const arr = [...prev];
      while (arr.length < slokas.length) arr.push("");
      while (arr.length > slokas.length) arr.pop();
      return arr;
    });
  }, [slokas.length]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 py-8">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 sm:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-orange-400 pl-2">Upload New Sloka Collection</h2>
            {/* Title Field */}
            <div className="mb-4">
              <label className="block font-semibold text-gray-700 mb-1">Title</label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                placeholder="Enter collection title..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            {/* Deity and Scripture Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Deity Dropdown */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Deity</label>
                <select
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none mb-2"
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
                    className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none mt-2"
                    placeholder="Enter custom deity"
                    value={customDeity}
                    onChange={e => setCustomDeity(e.target.value)}
                    required
                  />
                )}
              </div>
              {/* Scripture Dropdown */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Scripture</label>
                <select
                  className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none mb-2"
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
                    className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none mt-2"
                    placeholder="Enter custom scripture"
                    value={customScripture}
                    onChange={e => setCustomScripture(e.target.value)}
                    required
                  />
                )}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-l-4 border-orange-400 pl-2">Slokas</h2>
            {slokas.map((sloka, idx) => (
              <div key={idx} className="bg-white shadow-xl rounded-2xl p-6 mb-8 border border-blue-100 relative">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold text-blue-700 text-xl">Sloka {idx + 1}</span>
                  {idx > 0 && (
                    <button type="button" className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-600 font-semibold px-3 py-1 rounded transition" onClick={() => removeSloka(idx)}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      Remove
                    </button>
                  )}
                </div>
                <label className="block font-semibold text-gray-700 mb-1">Original Text (Sanskrit) *</label>
                <textarea
                  className="w-full rounded-lg border border-gray-300 p-3 mb-3 focus:ring-2 focus:ring-blue-300 focus:outline-none resize-vertical min-h-[80px]"
                  placeholder="Enter Sanskrit text here..."
                  value={sloka.originalText}
                  onChange={e => handleSlokaChange(idx, "originalText", e.target.value)}
                  onBlur={() => handleSlokaOriginalBlur(idx)}
                  required
                />
                <button
                  type="button"
                  className="mb-4 flex items-center gap-2 bg-[#4A90E2] hover:bg-[#357ABD] text-white px-4 py-2 rounded-lg shadow transition"
                  onClick={() => handleSlokaOriginalBlur(idx)}
                  disabled={slokaLoading[idx]}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l-4 4m0 0l-4-4m4 4V3" /></svg>
                  {slokaLoading[idx] ? "Generating..." : "Generate Transliteration"}
                </button>
                <p className="text-xs text-gray-500 mb-2 ml-1">We use AI to generate the transliteration and meaning. You can review, edit, and upload your own version.</p>
                {slokaError[idx] && <div className="text-red-500 mb-2">{slokaError[idx]}</div>}
                <div className="mb-4">
                  <label className="block font-semibold text-gray-700 mb-1">Transliteration</label>
                  <div className="flex flex-col gap-2">
                    <textarea
                      className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none resize-vertical min-h-[48px]"
                      placeholder="English transliteration"
                      value={sloka.transliteration.en}
                      onChange={e => handleSlokaChange(idx, "transliteration", e.target.value, "en")}
                    />
                    <textarea
                      className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none resize-vertical min-h-[48px]"
                      placeholder="Telugu transliteration"
                      value={sloka.transliteration.te}
                      onChange={e => handleSlokaChange(idx, "transliteration", e.target.value, "te")}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block font-semibold text-gray-700 mb-1">Meaning</label>
                  <div className="flex flex-col gap-2">
                    <textarea
                      className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none resize-vertical min-h-[48px]"
                      placeholder="English meaning"
                      value={sloka.meaning.en}
                      onChange={e => handleSlokaChange(idx, "meaning", e.target.value, "en")}
                    />
                    <textarea
                      className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none resize-vertical min-h-[48px]"
                      placeholder="Hindi meaning"
                      value={sloka.meaning.hi}
                      onChange={e => handleSlokaChange(idx, "meaning", e.target.value, "hi")}
                    />
                    <textarea
                      className="w-full rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-300 focus:outline-none resize-vertical min-h-[48px]"
                      placeholder="Telugu meaning"
                      value={sloka.meaning.te}
                      onChange={e => handleSlokaChange(idx, "meaning", e.target.value, "te")}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block font-semibold text-gray-700 mb-1">Audio File</label>
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4h-4a1 1 0 01-1-1v-1a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 01-1 1z" /></svg>
                    <span className="text-blue-500">Click to upload audio file or drag and drop</span>
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={e => handleAudioChange(idx, e.target.files?.[0] || null)}
                    />
                    {sloka.audioFile && <span className="text-xs text-gray-500 mt-1">{sloka.audioFile.name}</span>}
                  </label>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="w-fit ml-0 flex items-center justify-center gap-2 bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold py-2 px-5 rounded-xl shadow transition mb-6"
              onClick={addSloka}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add New Sloka
            </button>
          </div>
          {message && <div className="mb-4 text-green-600 font-semibold text-center">{message}</div>}
          <button
            type="submit"
            className="w-full max-w-xs mx-auto bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow transition text-lg"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </ErrorBoundary>
  );
}

export default function UploadPageWithBoundary() {
  return (
    <ErrorBoundary>
      <UploadPage />
    </ErrorBoundary>
  );
}

export default function UploadPageWithBoundary() {
  return (
    <ErrorBoundary>
      <UploadPage />
    </ErrorBoundary>
  );
} 