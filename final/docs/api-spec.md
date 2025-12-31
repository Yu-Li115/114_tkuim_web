# API 規格說明文件 (API Specification)
## 1. 全域規範 (Global Standard)
基礎 URL (Base URL): http://localhost:3000/api 
數據格式: 所有請求與回應皆使用 JSON 格式。 
統一回應結構:
success: Boolean (請求是否成功) 
message: String (結果描述訊息)
data: Object/Array (回傳資料，若失敗則為 null)

## 2. 商品 API (Products API)
管理咖啡廳選單資訊。
A. 取得所有商品 (Read All)
路由: GET /products
功能: 從 MongoDB 讀取所有可供點購的咖啡與產品。
成功回應範例 (200 OK):
JSON
{
  "success": true,
  "message": "取得商品列表成功",
  "data": [
    { "_id": "001", "name": "拿鐵", "price": 120, "category": "Coffee", "stock": 10 }
  ]
}
B. 取得特定商品 (Read Single)
路由: GET /products/:id
功能: 根據 ID 查詢特定產品詳細資訊。
C. 新增/更新商品 (Create/Update)
路由: POST /products 或 PUT /products/:id
功能: 管理員維護菜單內容。

##  3. 評論 API (Reviews API)
處理顧客對產品的評價互動。
A. 新增評論 (Create)
路由: POST /reviews
功能: 顧客對特定咖啡品項送出評分與心得。
請求內容 (Request Body):
JSON
{
  "product": "Product_ObjectId",
  "userName": "YuLiChien",
  "rating": 5,
  "comment": "風味極佳，服務迅速！"
}
B. 取得商品評論 (Read)
路由: GET /reviews/:productId
功能: 載入特定商品下方的所有顧客評論。
C. 修改評論 (Update)
路由: PUT /reviews/:id
功能: 顧客針對已送出的評論進行星數或文字調整。
請求內容: {"rating": 4, "comment": "更新後的評論內容"}
D. 刪除評論 (Delete)
路由: DELETE /reviews/:id
功能: 移除指定的評論資料。

##  4. HTTP 狀態碼與錯誤處理 (Error Handling)
系統透過一致的錯誤處理機制，回傳正確的 HTTP 狀態碼：
200 OK: 請求成功執行。 
201 Created: 資源（如評論）新增成功。 
400 Bad Request: 客戶端輸入不合法（例如評分未在 1-5 之間）。 
404 Not Found: 找不到指定的資源（例如錯誤的商品 ID）。 
500 Internal Server Error: 伺服器端發生非預期錯誤。