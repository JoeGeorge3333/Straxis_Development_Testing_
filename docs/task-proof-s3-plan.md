# Task proof (image) → S3 — planning notes

This document maps how **photo / screenshot proof** attaches to **tasks** before we wire a real bucket and API. Use it as the contract between UI, app state, and backend.

---

## Product intent

- Each **task** (especially “Progress pic” style rows) can optionally require or allow **one proof image per day** (or per log submission—pick one rule; see *Decision* below).
- User uploads from **task detail** (and optionally a quick attach from the task row later).
- Images live in **S3**; the app stores **metadata + key**, not the file in Redux/local state long term.

---

## UX touchpoints (web `src/`)

| Area | Behavior (planned) |
|------|----------------------|
| **Task detail** (`pages/TaskDetailPage.tsx`) | New **“Proof”** section: thumbnail or placeholder, **Choose file** / drag-drop, optional caption. Show upload state: idle → uploading → done / error. |
| **Task list** (`components/TaskItem.tsx`) | Small **icon** (e.g. camera or check) when today’s row has proof attached for *this user* / *this day*. |
| **Data / logs** (`pages/DataLogsPage.tsx`) | If a log entry includes proof, show **link or thumb** (signed GET URL or CDN). |
| **League / challenge** | Optional per-task flag `requiresProof: boolean` on `ChallengeTaskDef` later—*not required for first slice*. |

**Decision (pick one early):**

1. **Per log submission** — each “Submit log” can attach 0–1 images; stored on `LogEntry`.  
2. **Per calendar day per task** — at most one proof for `(userId, taskId, rollDayKey)`; stored separately from logs but linked to task + day.

Recommendation for **75 Hard–style**: **(2)** for “daily proof” tasks; keep **log notes** separate. For generic tasks, **(1)** is simpler. This plan supports both by naming tables/fields clearly.

---

## Data model (target)

### Option A — proof on log entry

```ts
// LogEntry (extend)
proofImage?: {
  s3Key: string;       // e.g. leagues/{leagueId}/users/{userId}/tasks/{taskId}/{uuid}.jpg
  bucket: string;
  mimeType: string;
  byteSize: number;
  width?: number;     // optional from client or server
  height?: number;
  createdAt: string;  // ISO
};
```

### Option B — proof as its own row (daily)

```ts
TaskProof {
  id: string;
  leagueId: string;
  userId: string;
  taskId: string;
  dayKey: string;      // YYYY-MM-DD, same as rollDayKey
  s3Key: string;
  mimeType: string;
  byteSize: number;
  createdAt: string;
}
```

**S3 key shape (either option):**  
`s3://{bucket}/leagues/{leagueId}/users/{userId}/tasks/{taskId}/{proofId}.{ext}`  
Keeps objects **partitioned by league**, easy lifecycle rules and deletes if a league is removed.

---

## S3 integration flow (standard pattern)

1. **Client** asks **API**: “I want to upload proof for task X” (auth JWT or session cookie).
2. **API** validates (member of league, task exists, size/mime policy), then returns **presigned PUT** URL + **public metadata** (`proofId`, `s3Key`, expiry).
3. **Client** `PUT`s file **directly to S3** with `Content-Type` header matching what was signed.
4. **Client** calls **API** `POST /proofs/complete` (or include in log submit) with `proofId` / `s3Key` so server **records** ownership and optional virus scan job.
5. **Reads**: API returns **presigned GET** or **CloudFront** URL for thumbnails; short TTL.

**Env (later):** `S3_BUCKET`, `S3_REGION`, IAM role for API to sign URLs; **CORS** on bucket for `PUT` from your web origin.

**Security checklist (later):**

- Max size (e.g. 5–10 MB), allowlist `image/jpeg`, `image/png`, `image/webp`.
- Auth on every minted URL; **do not** expose bucket-wide public write.
- Optional: server-side **head-object** after upload to confirm size/type before marking complete.

---

## Mock / pre-S3 UI (current codebase)

Until the API exists:

1. **UI only** in `TaskDetailPage`: file input + `URL.createObjectURL` for local preview; **do not** persist blob in global Redux (memory leak if many).
2. Store a **`proofPreviewUrl: string | null`** in **local component state** only, or a `pendingProof: File | null` that clears after submit.
3. On “Submit log”, append log entry with `value: "with_proof_pending"` or extend `LogEntry` with optional `localPreviewOnly: true` for demo—**clearly labeled mock**.

When API lands, replace steps with presigned flow and store **`s3Key`** from server response in state / refetch logs.

---

## Files likely to change at integration time

| File | Change |
|------|--------|
| `web/src/types.ts` | Extend `LogEntry` and/or add `TaskProof`; optional `requiresProof` on `ChallengeTaskDef`. |
| `web/src/pages/TaskDetailPage.tsx` | Proof section + upload handlers. |
| `web/src/state.tsx` | Reducer/actions for attaching proof metadata to log or `taskProofs` map. |
| `web/src/components/TaskItem.tsx` | Indicator when proof exists for today. |
| `web/src/pages/DataLogsPage.tsx` | Render thumb/link when `s3Key` present. |
| New `web/src/services/proofsApi.ts` | `requestUploadUrl`, `confirmUpload`, `getViewUrl` (fetch wrappers). |

---

## Open questions (answer before coding S3)

1. **One proof per day per task** vs **per log event**?  
2. **Delete / replace** same-day proof allowed?  
3. **Moderation** — report flow needed for v1?  
4. **Mobile (Expo)** — same API; use `expo-image-picker` + presigned PUT.

---

## Summary

- **Notes live here**; implementation starts with **Task detail UI + local preview**, then **presigned S3 PUT** + **persist `s3Key`** via your backend when ready.
