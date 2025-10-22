// example5_script.js
// 以巢狀 for 產生 1~9 的乘法表

var output = '';
for (var i = 1; i <= 9; i++) {
  for (var j = 1; j <= 9; j++) {
    output += i + 'x' + j + '=' + (i * j) + '\t';
  }
  output += '\n';
}

// 🔹 延伸練習：使用者輸入要顯示的乘法範圍
var start = prompt('請輸入起始的乘法數（例如 2）：');
var end = prompt('請輸入結束的乘法數（例如 5）：');

var s = parseInt(start, 10);
var e = parseInt(end, 10);

if (isNaN(s) || isNaN(e) || s < 1 || e > 9 || s > e) {
  output += '\n輸入範圍不正確，請輸入 1~9 之間的整數，且起始不得大於結束。';
} else {
  output += '\n【延伸練習】' + s + ' 到 ' + e + ' 的乘法表：\n';
  for (var x = s; x <= e; x++) {
    for (var y = 1; y <= 9; y++) {
      output += x + 'x' + y + '=' + (x * y) + '\t';
    }
    output += '\n';
  }
}

document.getElementById('result').textContent = output;