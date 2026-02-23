
# REFRESHHOM
For reselling used furniture

# REFRESHHOM Full-Stack Marketplace (React + Node/Express + MongoDB + Cloudinary + Socket.io)

## Prereqs
- Node.js 18+
- MongoDB (local or Docker)
- Cloudinary account (cloud name, api key, api secret)

## Local Run

### 1) MongoDB
Using Docker:
```bash
docker run -d --name mongo -p 27017:27017 mongo:7
```

### 2) Server
```bash
cd server
cp .env.example .env
# fill your env values
npm install
npm run dev
```
Health check: http://localhost:8080/health

### 3) Client
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
Open: http://localhost:5173

## Env files

### server/.env
See `server/.env.example`

### client/.env
See `client/.env.example`

