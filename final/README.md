# 114（上）網路程式設計期末專題 - final
## 專題名稱：虛擬咖啡廳「線上點餐與評價」(Digital Cafe Order & Review)

### 1. 專案主題與目標
本專案建立一個虛擬咖啡廳平台，讓使用者可以瀏覽咖啡廳菜單、進行線上點餐模擬，並針對產品留下評價與評分。此專案旨在展示前後端整合、MongoDB 資料庫設計、以及完整的 CRUD 操作流程，提供使用者視覺化的前端介面進行資料操作。

### 2. 技術選擇原因
前端 (React.js)：採用現代化框架實作元件化開發與狀態管理，提升開發效率與介面互動性。
後端 (Node.js + Express)：建立 RESTful API 服務，因其架構靈活且能有效處理非同步請求，並確保避開舊式資安風險架構。
資料庫 (MongoDB)：使用 Mongoose ODM 進行資料建模。其文件導向特性適合處理具層次感的菜單與評論資料，滿足專題對資料庫設計的要求。
樣式設計 (Lucide React / CSS Flexbox)：提升系統介面美觀度與一致性，並實作響應式設計 (RWD) 以優化使用者操作體驗。

### 3. 架構說明與圖示
專案遵循建議之目錄結構，區分 frontend、backend 與 docs 資料夾。
架構圖：位於 docs/architecture.png，展示前端、後端與 MongoDB 的整合方式。
流程圖：位於 docs/flowchart.png，描述使用者透過前端操作後，資料經 API 流向資料庫的 CRUD 流程。
設計模式 (加分項)：後端採用 Service Pattern (於 orderService.js) 處理業務邏輯，並透過 responseHandler.js 實作統一回應格式與錯誤處理。

### 4. API 規格說明摘要
詳細規格請參閱 docs/api-spec.md。
GET /api/products：取得所有菜單 (Read All)。
POST /api/reviews：顧客留下評價 (Create)。
PUT /api/reviews/:id：修改星數或留言 (Update)。
DELETE /api/reviews/:id：撤回或刪除評論 (Delete)。

### 5. 安裝與執行指引
請確保本機已安裝 Node.js 與 MongoDB。
後端啟動 (Backend)
進入 backend 目錄：cd backend。
安裝套件：npm install。
初始化資料：node seed.js (建立初始資料庫內容)。
啟動伺服器：node server.js。
前端啟動 (Frontend)
進入 frontend 目錄：cd frontend。
安裝套件：npm install。
啟動 React 服務：npm start。

### 6. 版本控制說明
本專案使用 Git 進行管理，具備至少 5 次以上的 commit 紀錄，並遵循 feat:, fix:, docs: 等明確的訊息規範。