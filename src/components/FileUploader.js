export class FileUploader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.innerHTML = `
      <style>
        .upload-window {
          max-width: 300px;
          padding: 20px 16px;
          background: linear-gradient(180.00deg, rgb(95, 92, 240),rgb(221, 220, 252) 42.5%,rgb(255, 255, 255) 100%);
          border-radius: 20px;
          text-align: center;
          color: white;
          font-family: Inter, sans-serif;
          position: relative;
        }
        h1 {
            margin: 31px 0 7px 0;
            font-size: 20px;
            font-weight: 600;
            line-height: 24px;
        }
        h2 {
            margin: 0;
            font-size: 13px;
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
          font-size: 24px;
          font-weight: 600;
          background: rgba(204, 204, 206, 0.28);
          border-radius: 50%;
        }
        .input-container {
          position: relative;
          display: inline-block;
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
          font-size: 17px;
          font-weight: 500;
          line-height: 21px;
        }
        .file-name-input:focus {
          outline: none;
        }
        .clear-input-btn {
          position: absolute;
          right: 5px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          color: gray;
        }
        .drag-area {
          border: 1px solid #A5A5A5;
          padding: 42px 27px;
          border-radius: 30px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.4);
        }
        .drag-area-inner {
          object-fit: cover;
          max-width: 170px;
        }
        .drag-area img {
          max-width: 100%;
          margin-bottom: 10px;
        }
        .drag-area-descr {
            font-size: 14px;
            font-weight: 400;
            line-height: 17px;
            color: #5F5CF0;
        }
        .progress-bar-container {
            border: 1px solid gray;
            border-radius: 10px;
            display: none;
            justify-content: space-between;
            align-items: center;
            padding: 3px;
            margin: 10px 0;
        }
        .progress-block {
            width: 37px;
            height: 28px;
            background: #5F5CF0;
            border-radius: 10px;
        }
        .progress-wrapper {
            width: 70%;
        }
        .progress-wrapper-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
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
        }
        .progress {
            width: 0;
            height: 100%;
            background: #5F5CF0;
            transition: width 0.2s;
        }
        .progress-close-btn {
          cursor: pointer;
          color: #5F5CF0;
          font-size: 24px;
          font-weight: 600;
          margin-right: 5px;
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
          width: 220px;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          padding: 15px;
          background: white;
          border-radius: 10px;
          text-align: center;
          color: black;
          font-family: Inter, sans-serif;
          font-size: 14px;
        }
        .modal-success {
            margin: 0 auto;
            width: 140px;
            text-align: left;
        }
        .close-modal {
          position: absolute;
          width: 34px;
          height: 34px;
          top: 10px;
          right: 10px;
          cursor: pointer;
          color: white;
          font-size: 24px;
          font-weight: 600;
          background: rgba(204, 204, 206, 0.28);
          border-radius: 50%;
        }
      </style>
      <div class="upload-window">
        <img class="close-btn" src="/src/assets/cross%20button.svg" alt="cross-btn">
        <h1 class="upload-window-title">Загрузочное окно</h1>
        <h2 class="upload-window-descr">Перед загрузкой дайте имя файлу</h2>
        <div class="input-container">
            <input type="text" id="search" class="file-name-input" placeholder="Название файла" />
            <button class="clear-input-btn">✖</button>
        </div>
        <div class="drag-area">
          <div class="drag-area-inner">
            <img src="/src/assets/docs.svg" alt="Документ">
            <div class="drag-area-descr">Перенесите ваш файл в область ниже</div>
          </div>
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
            <span class="progress-close-btn">&times;</span>
        </div>
        <button class="upload-button" disabled>Загрузить</button>
      </div>
      <div class="modal">
        <img class="close-modal" src="/src/assets/cross%20button.svg" alt="cross-btn">
        <div class="modal-message"></div>
      </div>
    `;
        this.fileName = "";

        this.uploadWindowDescr = this.shadowRoot.querySelector(".upload-window-descr");
        this.fileInput = this.shadowRoot.querySelector(".file-input");
        this.fileNameInput = this.shadowRoot.querySelector(".file-name-input");
        this.clearInputBtn = this.shadowRoot.querySelector(".clear-input-btn");
        this.dragArea = this.shadowRoot.querySelector(".drag-area");
        this.progressBarContainer = this.shadowRoot.querySelector(".progress-bar-container");
        this.progressTitle = this.shadowRoot.querySelector(".progress-title");
        this.progressBar = this.shadowRoot.querySelector(".progress-bar");
        this.progress = this.shadowRoot.querySelector(".progress");
        this.progressText = this.shadowRoot.querySelector(".progress-text");
        this.progressCloseBtn = this.shadowRoot.querySelector(".progress-close-btn");
        this.uploadButton = this.shadowRoot.querySelector(".upload-button");
        this.modal = this.shadowRoot.querySelector(".modal");
        this.modalMessage = this.shadowRoot.querySelector(".modal-message");
        this.closeModalButton = this.shadowRoot.querySelector(".close-modal");
        this.closeBtn = this.shadowRoot.querySelector(".close-btn");

        this.fileNameInput.addEventListener("input", () => this.updateDescr());
        this.fileNameInput.addEventListener("input", () => this.updateButtonState());
        this.clearInputBtn.addEventListener("click", () => this.clearInput());
        this.uploadButton.addEventListener("click", () => this.uploadFile());
        this.dragArea.addEventListener("click", () => this.fileInput.click());
        this.fileInput.addEventListener("change", () => this.handleFileSelect());
        this.fileInput.addEventListener("change", () => this.simulateProgress());
        this.fileInput.addEventListener("change", () => this.changeNameFile());
        this.closeModalButton.addEventListener("click", () => this.modal.style.display = "none");
        this.closeBtn.addEventListener("click", () => this.remove());
        this.progressCloseBtn.addEventListener("click", () => this.removeFile());
    }

    startPageChanged() {
        this.fileNameInput.value = "";
        this.fileInput.value = "";
        this.fileNameInput.style.display = "block";
        this.clearInputBtn.style.display = "inline";
        this.progressBarContainer.style.display = "none";
        this.uploadWindowDescr.textContent = "Перед загрузкой дайте имя файлу";
        this.uploadButton.disabled = true;
    }

    changeNameFile() {
        if (!this.fileNameInput.value.trim()) {
            this.progressTitle.textContent = `Безымянный${this.dragArea.textContent.slice(-4)}`;
        }
        this.progressTitle.textContent = this.fileNameInput.value + this.fileName.slice(-4);
    }

    clearInput() {
        this.fileNameInput.value = "";
        this.uploadWindowDescr.textContent = "Перед загрузкой дайте имя файлу";
        this.clearInputBtn.style.color = "grey";
    }

    updateDescr() {
        if (this.fileNameInput.value.trim()) {
            this.uploadWindowDescr.textContent = "Перенесите ваш файл в область ниже";
            this.clearInputBtn.style.color = "#5F5CF0";
        } else {
            this.uploadWindowDescr.textContent = "Перед загрузкой дайте имя файлу";
        }
    }

    handleFileSelect() {
        const file = this.fileInput.files[0];
        if (!file) return;

        const validTypes = ["text/plain", "application/json", "text/csv"];
        if (!validTypes.includes(file.type)) {
            this.fileInput.value = "";
            return this.showModal({
                status: "Ошибка файла",
                statusText: "",
                message: "Неподдерживаемый формат файла."
            }, true);
        }
        if (file.size > 1024) {
            this.fileInput.value = "";
            return this.showModal({
                status: "Ошибка файла",
                statusText: "",
                message: "Размер файла превышает 1MB."
            }, true);
        }
        this.fileName = file.name;
    }

    simulateProgress() {
        if (!this.fileInput.files.length) return;

        this.fileNameInput.style.display = "none";
        this.clearInputBtn.style.display = "none";
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
                this.progressBar.style.display = "none";
                this.progressTitle.style.fontSize = "16px";
                this.updateButtonState();
            }
        }, 200);
    }

    removeFile() {
        this.startPageChanged()
    }

    updateButtonState() {
        this.uploadButton.disabled = !(this.fileInput.files.length && this.fileNameInput.value.trim());
    }

    showModal(response, isError = false) {
        this.modalMessage.innerHTML = isError ? `<h1>Ошибка в загрузке файла</h1>
           <div>Error: ${response.status} ${response.statusText}</div>
           <div>"${response.message}"</div>` : `<h1>Файл успешно загружен</h1>
           <div class="modal-success">
               <div>name: ${response.name}</div>
               <div>filename: ${response.filename.split('_').pop()}</div>
               <div>timestamp: ${new Date(response.timestamp).toLocaleTimeString()}</div>
               <div>message: ${response.message}</div>
           </div>`;

        this.modal.style.display = "block";
        this.modal.style.background = isError ? "linear-gradient(to bottom, #FF6B6B, #6A82FB)" : "linear-gradient(to bottom, #5F5CF0, #8B78F6)";

        this.modal.style.color = "white";
        this.modal.style.padding = "20px";
        this.modal.style.borderRadius = "10px";
    }

    async uploadFile() {
        const file = this.fileInput.files[0];
        if (!file) return;

        this.uploadButton.disabled = true;
        this.progressBar.style.display = "flex";
        this.progressBar.style.width = "0%";
        let progress = 0;

        const interval = setInterval(() => {
            progress += 20;
            this.progressBar.style.width = `${progress}%`;
            this.progressText.textContent = `${Math.round(progress)}%`;
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
                    status: response.status, statusText: response.statusText, message: result.message
                }, true);
            }
        } catch (error) {
            this.showModal({status: "Network Error", statusText: "", message: "Ошибка сети"}, true);
        } finally {
            this.startPageChanged()
        }
    }
}

customElements.define("file-uploader", FileUploader);
