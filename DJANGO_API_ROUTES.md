# Django API Routes for Skin One Frontend

Base URL: `${VITE_API_BASE_URL}`

All JSON responses should use `application/json`. Use JWT or token-based auth; the frontend sends `Authorization: Bearer <token>` when logged in.

## Auth

- POST /auth/register/
  - Request: { name, email, password, coren, specialty, institution }
  - Response: 201 Created, { id, name, email }

- POST /auth/login/
  - Request: { email, password }
  - Response: 200 OK, { token, user: { id, name, email } }

<!-- Google auth removed from frontend; backend route no longer needed. -->

- GET /auth/me/
  - Auth required
  - Response: 200 OK, { id, name, email }

## Images

- GET /images/
  - Auth required
  - Response: 200 OK, [ { id, url, patient? } ]

- POST /images/upload/
  - Auth required
  - Multipart form
  - Field: images (repeatable) -> multiple files allowed
  - Response: 201 Created, { upload_batch_id, uploaded }

## Classifications

- POST /classifications/
  - Auth required
  - Request: { image_id: string, stage: "estagio1"|"estagio2"|"estagio3"|"estagio4"|"nao_classificavel"|"dtpi", justification?: string }
  - Response: 201 Created, { id, image_id, stage, created_at }

- GET /classifications/?image_id=<id>
  - Auth required
  - Response: 200 OK, [ { id, image_id, stage, created_at } ]

## Errors

Return JSON errors with proper HTTP status and a message field:

```
{ "message": "Validation failed", "errors": { "field": ["error"] } }
```

## CORS

Allow CORS from the frontend dev host and production domain:
- Origins: http://localhost:8080, https://<prod-domain>
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: Authorization, Content-Type

## Auth Notes

- Prefer `django-rest-framework` + `djangorestframework-simplejwt` or equivalent.
- Login returns an access token; the frontend stores it only in `localStorage` right now.
- All protected endpoints should require `Authorization: Bearer <token>`.
