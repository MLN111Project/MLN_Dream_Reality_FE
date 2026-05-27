# Deploy Dream Reality (Vercel + Game Server)

Vercel **không** chạy WebSocket lâu dài. Cần tách:

| Phần | Nền tảng | Lệnh / URL |
|------|----------|------------|
| Frontend (React) | **Vercel** | `npm run build` |
| Game server (Socket.io + API + AI) | **Render** hoặc **Railway** | `npm start` |

---

## 1. Deploy game server (WebSocket)

### Render (khuyên dùng, free)

1. Đẩy repo lên GitHub.
2. [render.com](https://render.com) → **New** → **Web Service** → chọn repo.
3. Cấu hình (quan trọng — **đừng** dùng `npm run build` cho server):
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node server/index.js` (không để mặc định `yarn start`)
   - **Health Check Path:** `/health`
   - **Root Directory:** để trống (thư mục gốc repo)
4. **Environment Variables:**
   - `CLIENT_ORIGINS` = URL Vercel của bạn, ví dụ `https://dream-reality.vercel.app`
   - `GEMINI_API_KEY` = key Gemini (nếu dùng AI kết thúc)
   - `GEMINI_MODEL` = `gemini-2.0-flash` (tuỳ chọn)
5. Deploy xong → copy URL, ví dụ: `https://dream-reality-game-server.onrender.com`

Hoặc dùng file `render.yaml` → **New Blueprint**.

### Railway

1. [railway.app](https://railway.app) → New Project → Deploy from GitHub.
2. **Start command:** `npm start`
3. Thêm biến `CLIENT_ORIGINS`, `GEMINI_API_KEY` như trên.
4. Copy public URL.

### Kiểm tra server

Mở: `https://YOUR-SERVER-URL/health`  
Phải thấy JSON `"ok": true`.

---

## 2. Deploy frontend lên Vercel

1. Import project GitHub trên Vercel.
2. **Framework:** Vite  
3. **Build Command:** `npm run build`  
4. **Output:** `dist`
5. **Environment Variables** (Production):

   | Name | Value |
   |------|--------|
   | `VITE_SOCKET_URL` | `https://YOUR-SERVER-URL.onrender.com` (không `/` cuối) |

6. **Redeploy** sau khi thêm biến môi trường.

File `vercel.json` đã cấu hình SPA rewrite.

---

## 3. Local dev (không đổi)

```bash
npm run dev:all
```

- FE: `http://localhost:5173` (proxy `/socket.io` → `:3001`)
- Server: `http://localhost:3001`

Không cần `VITE_SOCKET_URL` khi dev.

---

## Lỗi Render: `error Command "start" not found`

Nguyên nhân thường gặp:

1. **Start Command** đang là `yarn start` (mặc định) nhưng project dùng npm → đổi thành:
   ```bash
   node server/index.js
   ```
2. **Build Command** đang là `npm run build` (build Vite cho FE) → server không cần bước này. Đổi thành:
   ```bash
   npm install
   ```
3. Chưa push `package.json` có script `"start"` lên GitHub → `git push` rồi **Manual Deploy** lại.

Trong Render Dashboard → service → **Settings** → sửa Build & Start → **Save** → **Deploy**.

---

## Lưu ý

- **Render free:** server sleep sau ~15 phút không dùng → lần đầu vào phòng có thể chờ 30–60s.
- Mỗi lần **restart server**, phòng cũ mất — tạo phòng mới.
- `CLIENT_ORIGINS` phải khớp đúng domain Vercel (có `https://`).
