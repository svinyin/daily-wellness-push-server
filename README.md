# Daily Wellness Push Server

Backend foundation for true background Web Push notifications.

## Endpoints
- GET / — server status
- GET /health — health check
- GET /api/health — API health check
- GET /api/vapid-public-key — VAPID public key
- POST /api/subscribe — browser PushSubscription
- POST /api/test-push — test push

## Render environment variables
- PORT
- VAPID_PUBLIC_KEY
- VAPID_PRIVATE_KEY
- VAPID_SUBJECT

Do not commit real secrets or a real .env file.
