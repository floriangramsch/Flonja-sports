## For Development

```bash
cp .env.example .env
npm run dev
```

.env befüllen

## For Deployment

```bash
npm i
docker compose build --no-cache
docker push
```

Dann auf dem Server

```bash
docker compose pull
docker compose up -d
```