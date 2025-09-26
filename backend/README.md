# DOC C+ Backend (Mock)

This folder provides a mock backend you can run locally and later swap implementations for AWS/IBM services.

- Runtime: Node + Express + TypeScript
- Auth: validates JWT shape (Cognito-compatible) in dev; use real JWKS in production
- Storage: in-memory stores, S3 pre-signed URL stubs
- AI: mocked watsonx/Bedrock/Comprehend Medical endpoints

## Commands

```
cd backend
npm install
npm run dev
```

Env: copy `.env.example` to `.env` and adjust.

## Routes (all prefixed with /api)
- POST /auth/login (mock)
- GET /auth/me
- GET /profiles/me, PUT /profiles/me
- GET /doctors, GET /doctors/:id
- GET /appointments, POST /appointments
- GET /availability/:doctorId
- GET /prescriptions, POST /prescriptions
- POST /ai/analyze
- GET /ai/recommend-doctors
- POST /upload/presign
- POST /chatbot/message 