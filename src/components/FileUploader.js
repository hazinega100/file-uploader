export class FileUploader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `
      <style>
        .upload-window {
          width: 302px;
          height: 479px;
          padding: 20px;
          background: linear-gradient(180.00deg, rgb(95, 92, 240),rgb(221, 220, 252) 42.5%,rgb(255, 255, 255) 100%);
          border-radius: 20px;
          text-align: center;
          color: white;
          font-family: Inter sans-serif;
          position: relative;
        }
        h1 {
            font-size: 20px;
            font-weight: 600;
            line-height: 24px;
        }
        h2 {
            font-size: 14px;
            font-weight: 300;
            line-height: 17px;
        }
        .close-btn {
          position: absolute;
          width: 34px;
          height: 34px;
          top: 10px;
          right: 10px;
          cursor: pointer;
          color: white;
          font-size: 30px;
          font-weight: 600;
          background: rgba(204, 204, 206, 0.28);
          border-radius: 50%;
        }
        .file-name-input {
          width: 90%;
          padding: 10px;
          border-radius: 10px;
          border: 1px solid rgb(165, 165, 165);
          text-align: start;
          margin: 10px 0;
          background: rgb(241, 241, 241);
          color: #5F5CF0;
          font-family: Inter;
            font-size: 17.5px;
            font-weight: 500;
            line-height: 21px;
        }
        .drag-area {
          border: 1px solid #A5A5A5;
          padding: 20px;
          border-radius: 30px;
          margin-bottom: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.4);
        }
        .drag-area img {
          width: 169px;
          height: 125px;
          margin-bottom: 10px;
        }
        .drag-area-descr {
            font-size: 14px;
            font-weight: 400;
            line-height: 17px;
            letter-spacing: 0;
            color: #5F5CF0;
        }
        .progress-bar-container {
            border: 1px solid gray;
            border-radius: 10px;
            display: none;
            padding: 3px;
        }
        .progress-block {
            width: 37px;
            height: 28px;
            background: #5F5CF0;
            border-radius: 10px;
        }
        .progress-wrapper {
            justify-content: space-between;
        }
        .progress-wrapper-title {
            display: flex;
            justify-content: space-between;
            color: #5F5CF0;
        }
        .progress-title {
            font-size: 10px;
            font-weight: 500;
            line-height: 12px;
        }
        .progress-text {
            font-size: 14px;
        }
        .progress-bar {
            width: 100%;
            height: 5px;
            background: #ddd;
            border-radius: 3px;
            overflow: hidden;
            margin: 10px 0;
        }
        .progress {
            width: 0;
            height: 100%;
            background: #5F5CF0;
            transition: width 0.2s;
        }
        .upload-button {
          width: 100%;
          padding: 10px;
          border: none;
          background: #5F5CF0;
          color: white;
          border-radius: 22px;
          cursor: pointer;
          font-size: 16px;
        }
        .upload-button:disabled {
          background: #BBB9D2;
          cursor: not-allowed;
        }
        .modal {
          display: none;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 20px;
          background: white;
          border-radius: 10px;
          text-align: center;
          color: black;
        }
      </style>
      <div class="upload-window">
        <span class="close-btn">&times;</span>
        <h1 class="upload-window-title">Загрузочное окно</h1>
        <h2 class="upload-window-descr">Перед загрузкой дайте имя файлу</h2>
        <input type="text" class="file-name-input" placeholder="Название файла" />
        <div class="drag-area">
          <img src="/src/assets/docs.svg" alt="Документ">
          <p class="drag-area-descr">Перенесите ваш файл в область ниже</p>
        </div>
        <input type="file" class="file-input" hidden accept=".txt,.json,.csv" />
        <div class="progress-bar-container">
            <div class="progress-block"></div>
            <div class="progress-wrapper">
                <div class="progress-wrapper-title">
                    <div class="progress-title">${this.fileNameInput}</div>
                    <span class="progress-text">0%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress"></div>
                </div>
            </div>
        </div>
        <button class="upload-button" disabled>Загрузить</button>
      </div>
      <div class="modal">
        <p class="modal-message"></p>
        <button class="close-modal">Закрыть</button>
      </div>
    `;
        this.fileName = "";

        this.uploadWindowDescr = this.shadowRoot.querySelector(".upload-window-descr");
        this.fileInput = this.shadowRoot.querySelector(".file-input");
        this.fileNameInput = this.shadowRoot.querySelector(".file-name-input");
        this.dragArea = this.shadowRoot.querySelector(".drag-area");
        this.progressBarContainer = this.shadowRoot.querySelector(".progress-bar-container");
        this.progressTitle = this.shadowRoot.querySelector(".progress-title");
        this.progressBar = this.shadowRoot.querySelector(".progress-bar");
        this.progress = this.shadowRoot.querySelector(".progress");
        this.progressText = this.shadowRoot.querySelector(".progress-text");
        this.uploadButton = this.shadowRoot.querySelector(".upload-button");
        this.modal = this.shadowRoot.querySelector(".modal");
        this.modalMessage = this.shadowRoot.querySelector(".modal-message");
        this.closeModalButton = this.shadowRoot.querySelector(".close-modal");
        this.closeBtn = this.shadowRoot.querySelector(".close-btn");

        this.fileNameInput.addEventListener("input", () => this.updateDescr());
        this.fileNameInput.addEventListener("input", () => this.updateButtonState());
        this.uploadButton.addEventListener("click", () => this.uploadFile());
        this.dragArea.addEventListener("click", () => this.fileInput.click());
        this.fileInput.addEventListener("change", () => this.handleFileSelect());
        this.fileInput.addEventListener("change", () => this.simulateProgress());
        this.fileInput.addEventListener("change", () => this.changeNameFile());
        this.closeModalButton.addEventListener("click", () => this.modal.style.display = "none");
        this.closeBtn.addEventListener("click", () => this.remove());
    }

    changeNameFile() {
        if (!this.fileNameInput.value.trim()) {
            this.progressTitle.textContent = `Безымянный${this.dragArea.textContent.slice(-4)}`;
        }
        this.progressTitle.textContent = this.fileNameInput.value + this.fileName.slice(-4);
    }

    updateDescr() {
        if (this.fileNameInput.value.trim()) {
            this.uploadWindowDescr.textContent = "Перенесите ваш файл в область ниже";
        } else {
            this.uploadWindowDescr.textContent = "Перед загрузкой дайте имя файлу";
        }
    }

    handleFileSelect() {
        const file = this.fileInput.files[0];
        if (!file) return;

        if (!["text/plain", "application/json", "text/csv"].includes(file.type)) {
            alert("Ошибка: Неподдерживаемый формат файла.");
            this.fileInput.value = "";
            return;
        }
        if (file.size > 1024) {
            alert("Ошибка: Размер файла превышает 1KB.");
            this.fileInput.value = "";
            return;
        }
        this.fileName = file.name;
    }

    simulateProgress() {
        if (!this.fileInput.files.length) return;

        this.fileNameInput.style.display = "none";
        this.progressBarContainer.style.display = "flex";
        this.progress.style.width = "0%";
        this.progressText.textContent = "0%";

        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress > 100) progress = 100;

            this.progress.style.width = `${progress}%`;
            this.progressText.textContent = `${Math.round(progress)}%`;

            if (progress === 100) {
                clearInterval(interval);
                this.uploadWindowDescr.textContent = "Загрузите ваш файл";
                this.updateButtonState();
            }
        }, 200);
    }

    updateButtonState() {
        this.uploadButton.disabled = !(this.fileInput.files.length && this.fileNameInput.value.trim());
    }

    showModal(response, isError = false) {
        this.modalMessage.innerHTML = isError
            ? `<h1>Ошибка в загрузке файла</h1>
           <p>Error: ${response.status} ${response.statusText}</p>
           <p>"${response.message}"</p>`
            : `<h1>Файл успешно загружен</h1>
           <p>name: ${response.name}</p>
           <p>filename: ${response.filename.split('_').pop()}</p>
           <p>timestamp: ${new Date(response.timestamp).toLocaleTimeString()}</p>
           <p>message: ${response.message}</p>`;

        this.modal.style.display = "block";
        this.modal.style.background = isError
            ? "linear-gradient(to bottom, #FF6B6B, #6A82FB)"
            : "linear-gradient(to bottom, #5F5CF0, #8B78F6)";

        this.modal.style.color = "white";
        this.modal.style.padding = "20px";
        this.modal.style.borderRadius = "10px";
    }

    async uploadFile() {
        const file = this.fileInput.files[0];
        if (!file) return;

        this.uploadButton.disabled = true;
        this.progressBar.style.width = "0%";
        let progress = 0;

        const interval = setInterval(() => {
            progress += 20;
            this.progressBar.style.width = `${progress}%`;
            if (progress >= 100) clearInterval(interval);
        }, 300);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("name", this.fileNameInput.value);

            const response = await fetch("https://file-upload-server-mc26.onrender.com/api/v1/upload", {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            clearInterval(interval);
            this.progressBar.style.width = "100%";

            if (response.ok) {
                this.showModal(result);
            } else {
                this.showModal({
                    status: response.status,
                    statusText: response.statusText,
                    message: result.message
                }, true);
            }
        } catch (error) {
            this.showModal({status: "Network Error", statusText: "", message: "Ошибка сети"}, true);
        } finally {
            this.fileNameInput.value = "";
            this.fileNameInput.style.display = "block";
            this.progressBarContainer.style.display = "none";
            this.uploadWindowDescr.textContent = "Перед загрузкой дайте имя файлу";
        }
    }
}

customElements.define("file-uploader", FileUploader);
