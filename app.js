class SpeechRecognitionApi {
  constructor(options) {
    const SpeechToText =
      window.speechRecognition || window.webkitSpeechRecognition;

    this.speechApi = new SpeechToText();
    this.speechApi.continuous = true;
    this.speechApi.interimResults = false;

    this.speechApi.lang = "vi-VN";
    this.isRecording = false;
    this.recordingInterval = null;
    this.recordCount = 0;
    this.maxRecordCount = document.querySelectorAll("#table-body tr").length;

    this.startRecording = () => {
      if (!this.isRecording && this.recordCount < this.maxRecordCount) {
        this.isRecording = true;
        console.log("Ghi âm bắt đầu lần thứ", this.recordCount + 1, 'Time 5s');
        this.speechApi.start();
        this.speechApi.onresult = (event) => {
          const result = event.results[0][0].transcript;
          const tableRows = document.querySelectorAll("#table-body tr");

          if (this.recordCount < tableRows.length - 1) {
            const outputCell =
              tableRows[this.recordCount].querySelector(".output");
                outputCell.textContent = result;
                console.log('Kết quả record tại thời điểm: ',result)
          }
        };
        this.recordingInterval = setInterval(() => {
          this.stopRecording();

          if (this.recordCount === this.maxRecordCount - 1) {
            clearInterval(this.recordingInterval);
          } else {
            setTimeout(() => {
              this.recordCount++;
              this.startRecording();
            }, 1000);
          }
        }, 5000);
      }
    };

    this.stopRecording = () => {
      if (this.isRecording) {
        this.isRecording = false;

        this.speechApi.stop();
        console.log("Dừng ghi âm lần thứ", this.recordCount + 1);
        clearInterval(this.recordingInterval);
      }
    };

    this.init();
  }

  init() {
    document.querySelector(".btn-start").addEventListener("click", () => {
      this.recordCount = 0; // Đặt lại recordCount
      this.startRecording();
    });

    document.querySelector(".btn-stop").addEventListener("click", () => {
      this.stopRecording();
    });
  }
}

window.onload = function () {
  var speech = new SpeechRecognitionApi({
    //output: document.querySelector('.output')
  });
};
