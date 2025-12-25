### 專案目標與成果
本專案實作了一個基於 Dockerized MongoDB 和 Node.js/Express 的後端服務，專注於會員報名資料的 CRUD (Create, Read, Update, Delete) 操作。前端沿用 Week09 表單並成功串接至此服務。
主要成果包括：
1. 成功設定 Docker Compose 啟動 MongoDB 容器。
2. 處理了 Email 唯一性檢查 (409 錯誤) 和 API 分頁邏輯。
3. 將 Week 09 前端表單的提交 URL 成功指向 Week 11 的後端 API。

### 環境與文件說明
1. 系統環境要求
    Node.js (LTS 版本)
    Docker Desktop (用於運行 MongoDB 容器)
    REST Client 擴充功能 (VS Code)
2. .env 檔案範例內容請在 Week11/server 目錄下建立 .env 檔案，填寫必要的連線資訊：變數名稱用途說明範例值PORT服務運行的端口3001MONGODB_URI資料庫連線字串mongodb://week11-user:week11-pass@localhost:27017/week11?authSource=week11ALLOWED_ORIGIN允許前端跨域的來源http://127.0.0.1:5500 (請依據您的 Live Server 地址調整)

### 啟動指南 (依文件一步一步重現)
步驟 1: 啟動 MongoDB 容器在 Week11/docker 目錄下執行：
    Bashcd Week11/docker
    docker compose up -d
    驗證：執行 docker ps 確認 week11-mongo 容器狀態為 Up。
    ![docker ps 驗證截圖](Week11/photo/docker%20ps.png)
步驟 2: 啟動 Node.js 後端服務切換到 Week11/server 目錄，然後啟動 Express 服務：Bashcd ../server
npm install 
npm run dev
服務啟動成功時，請確認輸出包含 [DB] Email index ensured。

### 測試方式與截圖證明
1. API 功能測試 (CRUD 驗證)使用 Week11/tests/api.http 文件，依序執行 POST, GET, PATCH, DELETE 請求，確保所有狀態碼正確。
    ![API 測試成功畫面截圖](Week11/photo/API%20測試.png)
2. 資料庫內容與結構證明 (必備截圖)
    A. Mongo Shell 查詢結果 (驗證資料寫入)：在終端機連線到 Mongo Shell，執行 db.participants.find()。
    ![mongosh 查詢結果截圖](Week11/photo/mongosh.png)
    B. MongoDB Compass 結構證明 (展示資料結構與索引)：連線到 Compass，展示 participants 集合的內容和結構。
    ![MongoDB Compass 截圖](Week11/photo/MongoDB%20Compass.png)

### 補充文件內容
docker-compose.yml 內容範例:
version: '3.9'
services:
  mongodb:
    image: mongo:7
    container_name: week11-mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password123
      MONGO_INITDB_DATABASE: week11
    volumes:
      - ./mongo-data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/init.js:ro

### REST 測試檔 (api.http) 範例HTTP@baseurl = http://localhost:3001
@last_id = 

### 1. 建立報名 (POST)
POST {{baseurl}}/api/signup
Content-Type: application/json

{
  "name": "測試學員",
  "email": "test-user@example.com",
  "phone": "0911222333"
}
> {% client.global.set("last_id", response.body.id); %}

### 2. 取得清單 (GET)
GET {{baseurl}}/api/signup?page=1&limit=5