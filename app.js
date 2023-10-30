class SpeechRecognitionApi {
    constructor(options) {
        const SpeechToText = window.speechRecognition || window.webkitSpeechRecognition;

        this.speechApi = new SpeechToText();
        this.speechApi.continuous = true;
        this.speechApi.interimResults = false;

        this.speechApi.lang = 'vi-VN';
        this.output = options.output ? options.output : document.createElement('div');
        this.isRecording = false;
        this.recordingTimeout = null;

        this.startRecording = () => {
            this.isRecording = true;
            console.log('Ghi âm bắt đầu');
            this.speechApi.start();
            if (this.recordingTimeout) {
                clearTimeout(this.recordingTimeout);
            }
            this.recordingTimeout = setTimeout(() => {
                this.stopRecording();
                console.log('Dừng ghi âm sau 5 giây');
            }, 5000);

            this.speechApi.onresult = (event) => {
                // Xử lý kết quả ghi âm ở đây
                
                const result = event.results[0][0].transcript;
                this.output.textContent = result;
                console.log(result)
            };
        };

        this.stopRecording = () => {
            this.isRecording = false;
            console.log('Ghi âm dừng');
            this.speechApi.stop();
            if (this.recordingTimeout) {
                clearTimeout(this.recordingTimeout);
                this.recordingTimeout = null;
            }
        };

        this.init();
    }

    init() {
        document.querySelector('.btn-start').addEventListener('click', () => {
            this.startRecording();
        });

        document.querySelector('.btn-stop').addEventListener('click', () => {
            this.stopRecording();
        });
    }
}

window.onload = function () {
    var speech = new SpeechRecognitionApi({
        output: document.querySelector('.output')
    });
};