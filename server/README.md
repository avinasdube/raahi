# Raahi Server Auth Endpoints

Base URL:

- Local: <http://localhost:8800/api>
- Prod: <https://raahi-server.onrender.com/api>

Auth routes:

- POST `/auth/signup`
  - Body: `{ "fullName" or "name": string, "email": string, "password": string }`
  - 201: `{ user, token }` and sets httpOnly cookie `access_token`
- POST `/auth/login`
  - Body: `{ "email": string, "password": string }`
  - 200: `{ user, token }` and sets httpOnly cookie `access_token`
- GET `/auth/logout`
  - 200: clears auth cookie
- GET `/auth/me`
  - Requires cookie or `Authorization: Bearer \<token\>`
  - 200: `{ user }`

Environment (.env):

- `PORT=8800`
- `CORS_ORIGIN=http://localhost:5173,http://localhost:3000`
- `MONGODB_URI=...`
- `JWT_SECRET=...`
- `TOKEN_EXPIRES_IN=7d`
- `TOKEN_MAX_AGE_DAYS=7`

Notes:

- CORS is configured to allow credentials. The client axios instance sets `withCredentials: true`.
- Cookies use `SameSite=None; Secure` in production for cross-site cookies.
