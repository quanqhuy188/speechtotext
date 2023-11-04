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
    // Khởi tạo biến để theo dõi số lần ghi âm và các biến đếm thời gian
    this.recordCount = 0;
    this.recordingInterval = null;
    this.countdownInterval = null;

    // Khởi tạo ứng dụng
    this.init();
  }

  // Phương thức để bắt đầu ghi âm
  startRecording() {
    if (this.recordCount < this.tableRows.length) {
      // Lấy ô hiển thị thời gian đếm ngược
      const timerCell = this.getTimerCell();
      // Đặt thời gian ban đầu là 5 giây và hiển thị nó
      this.recordTime = 5;
      this.updateTimerDisplay(timerCell);

      console.log(`Ghi âm bắt đầu lần thứ ${this.recordCount + 1}, Time 5s`);
      // Đổi màu nền của hàng đang ghi âm
      this.tableRows[this.recordCount].style.backgroundColor = "yellow";
      this.speechApi.start();

      // Tạo bộ đếm thời gian giảm dần
      this.countdownInterval = setInterval(() => {
        this.recordTime--;
        this.updateTimerDisplay(timerCell);
        if (this.recordTime === 0) {
          clearInterval(this.countdownInterval);
          this.stopRecording();
          if (this.recordCount < this.tableRows.length - 1) {
            setTimeout(() => {
              this.recordCount++;
              this.startRecording();
            }, 500);
          } else {
            clearInterval(this.recordingInterval);
          }
        }
      }, 1000);

      // Bắt đầu ghi âm cho 5 giây
      this.recordingInterval = setInterval(() => {
        this.stopRecording();
        if (this.recordCount < this.tableRows.length - 1) {
          setTimeout(() => {
            this.recordCount++;
            this.startRecording();
          }, 500);
        } else {
          console.log("Kết thúc ghi âm cho tất cả các hàng");
          clearInterval(this.recordingInterval);
        }
      }, 5000);
    }
  }

  // Phương thức để dừng ghi âm
  stopRecording() {
    if (this.recordingInterval) {
      // Lấy ô hiển thị thời gian đếm ngược
      const timerCell = this.getTimerCell();
      console.log(`Dừng ghi âm lần thứ ${this.recordCount + 1}`);
      // Xóa màu nền của hàng
      this.tableRows[this.recordCount].style.backgroundColor = "";
      this.speechApi.stop();
      this.recordTime = 0;
      this.updateTimerDisplay(timerCell);
      clearInterval(this.recordingInterval);
      clearInterval(this.countdownInterval);
    }
  }

  // Xử lý kết quả từ SpeechRecognition
  handleSpeechResult(event) {
    const result = event.results[0][0].transcript;
    console.log(`Kết quả record tại thời điểm: ${result}`);
    const inputCell = this.tableRows[this.recordCount].querySelectorAll(".input");
    const resultText = result.toLowerCase().trim();
    const outputCell =
      this.tableRows[this.recordCount].querySelector(".output");
    const resultCell =
      this.tableRows[this.recordCount].querySelector(".result");
    outputCell.textContent = result;
    for(var i = 0; i < inputCell.length; i++) {
      const inputText = inputCell[i].textContent.trim().toLowerCase();
      if( inputText === resultText) {
        resultCell.textContent = 'Đúng'
        return;
      }
      else {
        resultCell.textContent = 'Sai'
      }
    }
  }
  // Khởi tạo ứng dụng và lắng nghe sự kiện
  init() {
    // Bắt đầu ghi âm khi nút "Bắt đầu" được nhấn
    document.querySelector(".btn-start").addEventListener("click", () => {
      this.recordCount = 0;
      this.startRecording();
    });

    // Dừng ghi âm khi nút "Dừng" được nhấn
    document.querySelector(".btn-stop").addEventListener("click", () => {
      this.stopRecording();
    });

    // Xử lý sự kiện khi có kết quả từ SpeechRecognition
    this.speechApi.onresult = (event) => this.handleSpeechResult(event);

    // Xử lý sự kiện khi không có kết quả trả về
    this.speechApi.onnomatch = () => {
      console.log("Không có kết quả trả về");
    };
  }

  // Lấy ô hiển thị thời gian đếm ngược
  getTimerCell() {
    return this.tableRows[this.recordCount].querySelector(".timer");
  }

  // Cập nhật hiển thị thời gian đếm ngược
  updateTimerDisplay(timerCell) {
    timerCell.textContent = this.recordTime;
  }
}

// Khởi tạo ứng dụng khi trang web đã tải xong
window.onload = function () {
  var speech = new SpeechRecognitionApi();
};
