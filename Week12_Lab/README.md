# Week12_Lab

## 專案簡介
本專案為 Week12 Lab 作業範例，使用 Express + MongoDB 實作報名系統，新增使用者身分與權限控管機制。  

功能包括：
- 使用者帳號系統（一般學員、管理員）
- 登入、JWT 驗證與角色授權
- CRUD 報名資料，依擁有者與角色限制存取
- 前端登入、報名表單、刪除資料、登出
- 加分項：Refresh Token / Session Store、忘記密碼 / 重設密碼流程、操作日誌紀錄

---

## 專案結構
Week12_Lab/
├─ server/
│  ├─ package.json
│  ├─ .env.example
│  ├─ src/
│  │  ├─ app.js
│  │  ├─ index.js
│  │  ├─ db.js
│  │  ├─ generateToken.js
│  │  ├─ repositories/
│  │  │  ├─ users.js
│  │  │  └─ participants.js
│  │  ├─ routes/
│  │  │  ├─ auth.js
│  │  │  └─ signup.js
│  │  ├─ middleware/
│  │  │  └─ auth.js
│  │  └─ scripts/
│  │     └─ hash-password.js
│  └─ tests/
│     ├─ auth.spec.js
│     └─ signup.spec.js
├─ client/
│  ├─ index.html
│  ├─ login.js
│  └─ signup_form.js
├─ docker/
│  └─ mongo-init.js
└─ README.md

---

## 環境設定
1. 複製 `.env.example` 為 `.env`，並修改以下變數：
PORT=3001
MONGODB_URI=mongodb://localhost:27017/week12
JWT_SECRET=請設定長隨機字串
JWT_EXPIRES_IN=2h
REFRESH_TOKEN_EXPIRES_IN=7d

2. 安裝 server 套件：
cd server
npm install

---

## 啟動方式

### 1. 啟動 MongoDB Docker
cd docker
docker compose up -d
> 會自動建立 week12 資料庫、users 與 participants 集合，以及預設 admin 帳號。

### 2. 啟動後端
cd server
npm run dev
- 伺服器預設運行於 http://localhost:3001

### 3. 開啟前端
直接開啟 client/index.html 即可。

---

## 帳號列表
帳號類型 | Email                 | 密碼
---------|---------------------|------
管理員   | admin@example.com    | admin1234
學生     | student1@example.com | pass1234
學生     | student2@example.com | pass1234
> 學生帳號可透過 /auth/signup 註冊

---

## 測試方式

### 1. 自動化測試
cd server
npm test
- 使用 Vitest + Supertest + Mongo Memory Server  
- 測試流程包含：
  - 未登入 → 被拒（401）
  - 登入成功 → 回傳 token
  - 權限不足 → 被拒（403）
  - 刪除成功 → 回傳 200

### 2. 手動測試（REST Client / Postman）
1. 登入  
POST /auth/login  
body:
{
  "email": "student1@example.com",
  "password": "pass1234"
}

2. 查看報名資料  
GET /api/signup  
需帶 Authorization: Bearer <token>  
- 學生 → 只能看到自己的資料  
- Admin → 可看到全部資料

3. 新增報名資料  
POST /api/signup  
body:
{
  "name": "小明 Week12",
  "email": "student12@example.com",
  "phone": "0912345678"
}

4. 刪除報名資料  
DELETE /api/signup/<id>  
- 只能刪自己資料或 admin 可刪全部

---

## 加分項功能
1. Refresh Token / Session Store
   - token 過期後可透過 refresh token 取得新 token
2. 忘記密碼 / 重設密碼流程
   - 提供 email 驗證與重設密碼 API
3. 操作日誌
   - 記錄每個使用者在什麼時間做了什麼操作（新增/刪除報名資料、登入登出等）

---

## 注意事項
- 確保 .env 裡有設定 JWT_SECRET
- 密碼不可以明碼存入資料庫
- Docker mongo-data 目錄會保留資料
- Admin 帳號可查看所有資料，學生僅能操作自己的資料
