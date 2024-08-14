const fileInput = document.getElementById("fileInput");
const imageElement = document.getElementById("image");
const resultElement = document.getElementById("result");

fileInput.addEventListener("change", async function () {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async function () {
      const image = new Image();
      image.src = reader.result;
      image.onload = async function () {
        imageElement.src = reader.result;
        imageElement.style.display = "block";
        // ....
        const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
        const detectorConfig = {
          runtime: "mediapipe", // or 'tfjs'
          solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
        };
        const detector = await faceLandmarksDetection.createDetector(
          model,
          detectorConfig
        );
        const faces = await detector.estimateFaces(image);
        if (faces?.length) {
          resultElement.textContent = `检测人脸数据：${faces?.length}`;
        } else {
          resultElement.textContent = `未检测人脸数据`;
        }
        // ....
      };
    };
    reader.readAsDataURL(file);
  }
});
