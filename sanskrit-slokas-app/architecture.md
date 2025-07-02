# Architecture Overview

**Date:** 2024-06-09

## Overview
This app is a modern, full-stack Sanskrit Slokas learning platform built with Next.js, Vercel Blob, and Neon Postgres. It supports dynamic sloka collection uploads, audio storage, and database-driven content delivery.

---

## Main Components

### 1. **Frontend (Next.js)**
- **Framework:** Next.js (App Router, TypeScript, React)
- **Features:**
  - Dynamic pages for sloka listing, learning, and uploading
  - Client-side and server-side rendering
  - Modern UI with form validation, audio preview, and responsive design

### 2. **API Routes (Next.js Edge Functions)**
- **Purpose:** Handle data upload, sloka collection creation, and audio file upload
- **Endpoints:**
  - `/api/upload-sloka` — Accepts POST requests to add new sloka collections and verses to the database
  - `/api/blob/upload` — Handles audio file uploads to Vercel Blob

### 3. **Audio Storage (Vercel Blob)**
- **Purpose:** Store and serve audio files for each sloka
- **Integration:** Audio files are uploaded from the frontend, stored in Vercel Blob, and URLs are saved in the database

### 4. **Database (Neon Postgres)**
- **Purpose:** Store all sloka collections, verses, and metadata
- **Schema:**
  - `collections` table: deities, scripture, title
  - `slokas` table: original text, transliteration, meaning, audio URL, collection reference
- **Access:** Via server-side utility functions using `@vercel/postgres`

### 5. **Data Flow**
1. **Upload:**
   - User fills out the upload form, selects audio, and submits
   - Audio is uploaded to Vercel Blob, URLs are returned
   - Sloka data and audio URLs are sent to `/api/upload-sloka` and stored in Neon Postgres
2. **Display:**
   - Pages like `/slokas/[deity]` and `/learn/[scriptureTitle]/[verseIndex]` fetch slokas from the database and display them dynamically
   - Audio is streamed from Vercel Blob

---

## Result
- The app is scalable, type-safe, and cloud-native, with clear separation of concerns between frontend, API, storage, and database.
- New slokas and audio can be added and accessed instantly, supporting a modern learning experience.

## AI Integration for Sloka Generation (2024-06-29)

The app integrates Google Gemini (via Google AI Studio) to automatically generate transliterations and meanings for Sanskrit slokas. This is achieved through a dedicated Next.js API route (`/api/generate-sloka`), which:

- Accepts Sanskrit text from the frontend upload page.
- Constructs a prompt with clear instructions, output format, and in-context examples, simulating a conversation (user: instructions/example input, model: example output, user: actual input) to maximize the likelihood of receiving a clean JSON response.
- Sends the prompt to the Gemini API using the latest supported model and endpoint.
- Post-processes the AI response to strip any markdown code fences before parsing the JSON, ensuring robust handling regardless of model quirks.
- Returns the parsed transliteration and meaning to the frontend, where it is displayed for user review and editing.

Error handling is implemented both server-side (logging and returning clear error messages) and client-side (displaying errors and allowing retry/edit). This AI integration is a core part of the sloka upload flow, streamlining content creation and enhancing user experience while maintaining reliability and transparency in the app's architecture. 