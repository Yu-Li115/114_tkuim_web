function tempConverter() {
  let input = prompt("請輸入溫度（例如：36C 或 100F）：");
  if (!input) return;

  let value = parseFloat(input);
  let unit = input.slice(-1).toUpperCase();
  let resultText = "";

  if (unit === "C") {
    let f = value * 9 / 5 + 32;
    resultText = `${value}°C = ${f.toFixed(2)}°F`;
  } else if (unit === "F") {
    let c = (value - 32) * 5 / 9;
    resultText = `${value}°F = ${c.toFixed(2)}°C`;
  } else {
    resultText = "格式錯誤！請輸入像 36C 或 100F。";
  }

  alert(resultText);
  document.getElementById("output").innerText = resultText;
}