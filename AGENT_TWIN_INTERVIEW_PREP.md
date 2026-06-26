# 🧠 Agent Twin — Interview Prep (start-to-finish)

Grounded in the real codebase (`~/Desktop/Agent-Twin`). Honest about where the résumé bullet is slightly ahead of the implementation, so you're never caught out.

---

## 1. The 30-second pitch (memorize)
> "Agent Twin is a full-stack web app that builds an **AI version of you**. You feed it your writing — resumes, posts, documents — and it does two things: **learns your writing style**, and **extracts the facts of your life** (jobs, projects, skills) into a structured memory. Then you chat with it and it writes resumes, cover letters, emails, or posts **in your voice, using your real history**. I also built a **voice agent** — it clones your voice with ElevenLabs so a recruiter can have a spoken conversation with a version of you via a shareable link. Backend is Django, the brain is Google Gemini, and it runs on a retrieve-then-generate (RAG-style) loop."

---

## 2. Plain English
A smart assistant that has read everything about you and can imitate how you write.
- **Learning phase (onboarding):** upload documents → it figures out *how* you write + *what* you've done → saves to a database.
- **Using phase:** "write me a cover letter" → it pulls your saved style + history → hands it to the AI → the AI writes it as you.

The "twin" = **your style + your memory**, fed to a language model every time.

---

## 3. Architecture (whiteboard this)
```
LEARNING:  file → file_parser → text → Gemini(extract) → {style, experiences, personal info} → saved to DB
USING:     prompt → RETRIEVE memory from DB → build prompt(style+history+question) → Gemini GENERATES in your voice
                 → (bonus) mine the chat for NEW facts → save to memory
VOICE:     browser speech-to-text → same loop → ElevenLabs speaks answer in YOUR cloned voice (shareable, rate-limited)
```
Key line: *"It's a retrieve → augment → generate loop."*

---

## 4. Tech stack (what + why)
- **Python / Django** — backend framework (URLs, DB, auth, admin).
- **Django REST Framework** — installed; used its **serializers**. (Most endpoints are actually Django function views — see gotchas.)
- **Google Gemini (`gemini-2.0-flash`)** — the LLM brain: learns style, extracts facts, reads images, generates content.
- **ElevenLabs** — voice cloning + text-to-speech (TTS).
- **SQLite** — Django's default DB; stores the memory tables.
- **PyPDF2 / Pillow / pydub** — parse PDFs / images / audio.
- **JSON** — frontend↔backend format; flexible fields (lists of achievements) stored via `JSONField`.

---

## 5. Codebase walkthrough (files + how they link)
`urls.py → views.py (endpoint) → services/* (logic) → models.py (data)` — clean layering.

- **`models.py`** (8 tables): `WritingStyle`, `Experience`, `PersonalInfo`, `DocumentMemory`, `VoiceProfile`, `VoiceShareToken`, `UserProfile` (+ Django `User`). Heavy `JSONField` use, `unique_together`, indexes, confidence scores.
- **`services/gemini_service.py`** — all Gemini calls: `extract_writing_style`, `extract_facts_and_experiences`, `analyze_image` (vision), `generate_content` (the big prompt), `extract_memory_from_conversation`.
- **`services/memory_extractor.py`** — saves Gemini output to DB with **de-duplication** (merge experiences by title+company; merge personal-info by key; weighted-average sentence length).
- **`services/memory_retriever.py`** — `get_user_memory_context(user)` = the "R" in RAG; pulls + formats the user's memory. Also builds the memory timeline.
- **`services/voice_service.py`** — ElevenLabs `create_voice_clone` + `text_to_speech`.
- **`utils/file_parser.py`** — PDF→PyPDF2, txt→read, image→Gemini Vision, audio→stub.
- **`views.py`** — endpoints; e.g. `generate_content`: prompt → retrieve memory → Gemini → return → mine convo for new facts.
- **`auth_views.py`** — signup/login/logout via Django **session auth**.

---

## 6. Terminology (simple → deep)

### ⭐ RAG — Retrieval-Augmented Generation
**Simple:** an LLM doesn't know *you*; before asking it, you **retrieve** your data and **paste it into the prompt** so the answer is **grounded** in real facts.
**Acronym:** Retrieval + Augmented + Generation.
**Why:** reduces **hallucination**; lets the model use private/personal info it was never trained on.
**In your project:** retrieve the user's stored style+experiences+personal info → inject into the prompt → Gemini generates.
**Honest nuance (say it first):** *"Mine is **structured/keyword retrieval**, not vector-embedding retrieval — each user's memory is small so I inject their full record. At scale I'd switch to **embeddings + a vector DB** for **semantic similarity search**."*

### Embeddings & vector DBs
- **Embedding:** text → a vector of numbers capturing meaning; similar meanings → nearby vectors.
- **Vector DB** (Pinecone, pgvector, FAISS): stores vectors, finds most similar fast (semantic search).
- You didn't need it (small per-user memory) — right tool for the job.

### LLM / prompt / hallucination / context window
- **LLM:** predicts next words; can write/answer (Gemini, GPT, Claude).
- **Prompt:** instructions + context you send. Your `generate_content` builds a big one.
- **Hallucination:** confidently making things up; RAG + "use only stored info" reduces it.
- **Context window:** max text a model reads at once — why retrieval/embeddings exist.

### Multimodal
Handling text + images + audio. Gemini Vision reads images (incl. OCR) in `analyze_image`.

### CRUD & ORM
- **CRUD:** Create/Read/Update/Delete.
- **ORM:** Django lets you write `Experience.objects.create(...)` instead of raw SQL.

### TTS & voice cloning
ElevenLabs Instant Voice Cloning: upload a sample → get `voice_id` → speak any text in that voice.

### Session auth
On login the server makes a session + sends a **cookie**; browser returns it; `@login_required` checks it. (Not JWT — know the difference.)

---

## 7. Defending your 3 résumé bullets
**1. "AI twin learns style + generates in your voice (Django + Gemini)"** → `extract_writing_style` → `WritingStyle`; `generate_content` injects style into the prompt. *Q: how do you capture style?* → structured signals (formality, sentence length, signature phrases, vocabulary) stored then re-injected.

**2. "memory system extracts/stores/retrieves from text, image, audio (RAG-style)"** → extract→store(dedup)→retrieve. Text ✓, Image ✓ (Vision). **Audio honesty:** *"Text + image are fully implemented. Audio is handled via the voice agent — speech is transcribed in the browser and the conversation is mined for memories; direct audio-file transcription was scaffolded but I prioritized the voice path."*

**3. "ElevenLabs voice cloning, shareable real-time conversations via custom REST endpoints"** → `upload_voice_sample`→`create_voice_clone`→store `voice_id`; `voice_ask` runs the loop then `text_to_speech`; `public_voice_ask`+`VoiceShareToken` = shareable + rate-limited, no login. *"Real-time" = turn-based spoken conversation, not full-duplex streaming.*

---

## 8. Gotcha questions
- **Is it真 DRF?** → "DRF + serializers are in the stack, but most endpoints are Django function views returning `JsonResponse`. I'd standardize on DRF + token auth if rebuilding."
- **Structured output from Gemini?** → "I prompt for JSON and parse it (regex to strip markdown fences + try/except fallbacks). Better: Gemini's structured-output/function-calling."
- **Avoid duplicate memories?** → merge experiences on title+company; merge personal-info by key keeping higher confidence; weighted-average sentence length.
- **Scale?** → SQLite→Postgres, embeddings+vector DB, caching, async/queued Gemini calls.
- **Security?** → move secrets to env vars (dev SECRET_KEY is hardcoded), DEBUG off, lock CORS (open in dev), token auth + rate limiting (already on public voice via `VoiceShareToken`).
- **Biggest challenge?** → reliable structured JSON from an LLM → prompt constraints + defensive parsing.
- **Improve?** → embeddings retrieval, real audio transcription (Whisper), DRF+JWT, streaming, tests.
- **Don't know something?** → "I haven't done that, but here's how I'd approach it…" — never bluff.
