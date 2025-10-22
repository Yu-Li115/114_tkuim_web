// example1_script.js
// 傳統語法：僅使用 var、function、字串串接

// 顯示提示窗
alert('歡迎來到 JavaScript！');

// 在 Console 顯示訊息
console.log('Hello JavaScript from console');

// 在頁面指定區域輸出文字
var el = document.getElementById('result');
el.textContent = '這行文字是由外部 JS 檔案寫入的。\n姓名：簡宥莉　學號：412637737'; 

// 🔹 延伸練習：按鈕點擊事件
var btn = document.getElementById('btnHello');
btn.onclick = function() {
  alert('哈囉！這是你點按按鈕後的提示訊息！');
};