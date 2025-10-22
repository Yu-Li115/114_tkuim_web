// example7_script.js
// 以函式封裝 BMI 計算與等級判斷

function calcBMI(heightCm, weightKg) {
  var h = heightCm / 100;
  var bmi = weightKg / (h * h);
  return bmi;
}

function bmiLevel(bmi) {
  var level = '';
  if (bmi < 18.5) {
    level = '過輕';
  } else if (bmi < 24) {
    level = '正常';
  } else if (bmi < 27) {
    level = '過重';
  } else if (bmi < 30) {
    level = '輕度肥胖';
  } else if (bmi < 35) {
    level = '中度肥胖';
  } else {
    level = '重度肥胖';
  }
  return level;
}

// 🔹 延伸練習：判斷 BMI 是否理想
function isIdeal(bmi) {
  return bmi >= 18.5 && bmi < 24;
}

// 🔹 延伸練習：平均分數對應等第
function gradeFromAverage(avg) {
  if (avg >= 90) {
    return 'A';
  } else if (avg >= 80) {
    return 'B';
  } else if (avg >= 70) {
    return 'C';
  } else if (avg >= 60) {
    return 'D';
  } else {
    return 'F';
  }
}

var hStr = prompt('請輸入身高（公分）：');
var wStr = prompt('請輸入體重（公斤）：');
var hNum = parseFloat(hStr);
var wNum = parseFloat(wStr);

var text = '';
if (isNaN(hNum) || isNaN(wNum) || hNum <= 0) {
  text = '輸入不正確';
} else {
  var bmi = calcBMI(hNum, wNum);
  text = '身高：' + hNum + ' cm\n'
       + '體重：' + wNum + ' kg\n'
       + 'BMI：' + bmi.toFixed(2) + '\n'
       + '等級：' + bmiLevel(bmi) + '\n'
       + '理想 BMI？ ' + isIdeal(bmi);
}

// 🔹 額外示範：平均分數對應等第
var score1 = parseFloat(prompt('請輸入第一科分數：'));
var score2 = parseFloat(prompt('請輸入第二科分數：'));
var score3 = parseFloat(prompt('請輸入第三科分數：'));

if (!isNaN(score1) && !isNaN(score2) && !isNaN(score3)) {
  var avg = (score1 + score2 + score3) / 3;
  text += '\n\n三科平均分數：' + avg.toFixed(2) + '，等第：' + gradeFromAverage(avg);
}

document.getElementById('result').textContent = text;