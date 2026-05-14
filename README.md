# crosspost_studio

Cross-post the same content to X (Twitter) and Threads from one composer. This is the AI Studio scaffold variant; see also `crosspost_antigravity` for the Next.js version.

## Env
- `X_API_KEY`
- `X_API_SECRET`
- `X_ACCESS_TOKEN`
- `X_ACCESS_SECRET`
- `THREADS_ACCESS_TOKEN`

## Run
```bash
npm install
npm run dev
```

## API
`POST /api/crosspost` accepts:
```json
{ "text": "string", "mediaUrls": ["optional string array"] }
```
