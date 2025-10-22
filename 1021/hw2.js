function guessNumber() {
  const answer = Math.floor(Math.random() * 100) + 1;
  let count = 0;
  let guess;

  while (true) {
    guess = prompt("請輸入你猜的數字（1–100）：");
    if (guess === null) {
      alert("遊戲取消。");
      break;
    }

    guess = Number(guess);
    count++;

    if (isNaN(guess) || guess < 1 || guess > 100) {
      alert("請輸入 1–100 之間的數字！");
      continue;
    }

    if (guess < answer) {
      alert("再大一點！");
    } else if (guess > answer) {
      alert("再小一點！");
    } else {
      alert(`恭喜你猜中了！答案是 ${answer}，共猜了 ${count} 次。`);
      document.getElementById("output").innerText =
        `猜數字遊戲結束 🎉\n答案：${answer}\n猜了 ${count} 次。`;
      break;
    }
  }
}