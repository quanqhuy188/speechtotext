// Định nghĩa lớp SpeechRecognitionApi
class SpeechRecognitionApi {
  constructor() {
    // Tạo một phiên bản của SpeechRecognition hoặc fallback cho trình duyệt khác
    const SpeechToText =
      window.speechRecognition || window.webkitSpeechRecognition;
    
    // Lấy danh sách các hàng trong bảng có id "table-body"
    this.tableRows = document.querySelectorAll("#table-body tr");
    
    // Tạo một đối tượng SpeechRecognition
    this.speechApi = new SpeechToText();
    
    // Cài đặt các thuộc tính của SpeechRecognition
    this.speechApi.continuous = true;
    this.speechApi.interimResults = false;
    this.speechApi.lang = "vi-VN";
    
    // Khởi tạo biến lưu trạng thái ghi âm và đếm hàng ghi âm
    this.recordCount = 0;
    this.recordingInterval = null;

    // Khởi tạo ứng dụng
    this.init();
  }

  // Phương thức để bắt đầu ghi âm
  startRecording() {
    if (this.recordCount < this.tableRows.length) {
      console.log(`Ghi âm bắt đầu lần thứ ${this.recordCount + 1}, Time 5s`);
      this.tableRows[this.recordCount].style.backgroundColor = "yellow";
      this.speechApi.start();
      this.recordingInterval = setInterval(() => {
        this.stopRecording();
        if (this.recordCount < this.tableRows.length - 1) {
          setTimeout(() => {
            this.recordCount++;
            this.startRecording();
          }, 500);
        } else {
          clearInterval(this.recordingInterval);
        }
      }, 5000);
    }
  }

  // Phương thức để dừng ghi âm
  stopRecording() {
    if (this.recordingInterval) {
      console.log(`Dừng ghi âm lần thứ ${this.recordCount + 1}`);
      this.tableRows[this.recordCount].style.backgroundColor = "";
      this.speechApi.stop();
      clearInterval(this.recordingInterval);
    }
  }

  // Xử lý kết quả từ SpeechRecognition
  handleSpeechResult(event) {
    const result = event.results[0][0].transcript;
    const inputCell = this.tableRows[this.recordCount].querySelector(".input");
    const outputCell = this.tableRows[this.recordCount].querySelector(".output");
    const resultCell = this.tableRows[this.recordCount].querySelector(".result");
    outputCell.textContent = result;
    console.log(`Kết quả record tại thời điểm: ${result}`);
    const inputText = inputCell.textContent.trim().toLowerCase();
    const resultText = result.toLowerCase().trim();
    resultCell.textContent = inputText === resultText ? "ĐÚNG" : "SAI";
    this.tableRows[this.recordCount].style.backgroundColor = inputText === resultText ? "green" : "red";
  }

  // Khởi tạo ứng dụng và lắng nghe sự kiện
  init() {
    document.querySelector(".btn-start").addEventListener("click", () => {
      this.recordCount = 0;
      this.startRecording();
    });

    document.querySelector(".btn-stop").addEventListener("click", () => {
      this.stopRecording();
    });

    // Xử lý sự kiện khi có kết quả từ SpeechRecognition
    this.speechApi.onresult = (event) => this.handleSpeechResult(event);

    // Xử lý sự kiện khi không có kết quả trả về
    this.speechApi.onnomatch = () => {
      console.log('Không có kết quả trả về');
    };
  }
}

// Khởi tạo ứng dụng khi trang web đã tải xong
window.onload = function () {
  var speech = new SpeechRecognitionApi();
};