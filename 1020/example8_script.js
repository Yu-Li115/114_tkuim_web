// example8_script.js
// 宣告一個學生物件，包含屬性與方法

var student = {
  name: '簡宥莉',
  id: '412637737',
  scores: [85, 90, 78],
  getAverage: function() {
    var sum = 0;
    for (var i = 0; i < this.scores.length; i++) {
      sum += this.scores[i];
    }
    return sum / this.scores.length;
  },
  info: function() {
    return '姓名：' + this.name + '\n學號：' + this.id;
  },
  // 🔹 延伸練習：回傳平均分數對應等第
  getGrade: function() {
    var avg = this.getAverage();
    var grade = '';
    if (avg >= 90) {
      grade = 'A';
    } else if (avg >= 80) {
      grade = 'B';
    } else if (avg >= 70) {
      grade = 'C';
    } else if (avg >= 60) {
      grade = 'D';
    } else {
      grade = 'F';
    }
    return grade;
  }
};

var text = student.info() + '\n平均：' + student.getAverage().toFixed(2)
         + '\n等第：' + student.getGrade();

document.getElementById('result').textContent = text;