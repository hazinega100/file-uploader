import "./components/FileUploader.js";

document.addEventListener("DOMContentLoaded", () => {
	const app = document.getElementById("app");
	if (app) {
		const uploader = document.createElement("file-uploader");
		app.appendChild(uploader);
	}
});
