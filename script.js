const video = document.querySelector("video");
const canvas = (window.canvas = document.querySelector("canvas"));
canvas.width = 480;
canvas.height = 360;
const ctx = canvas.getContext("2d");

ctx.fillStyle = "green";
ctx.fillRect(0, 0, canvas.width, canvas.height);
let pixels = [];

class Pixel {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = 0;
    this.speed = Math.random() * 2 + 0.01;
    this.size = Math.random() * 0.5 + 1;
  }

  update() {
    this.y += this.speed;
    if (this.y > canvas.height) {
      this.y = 0;
      this.x = Math.random() * canvas.width;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = "white";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function invertColors(data) {
  for (var i = 0; i < data.length; i += 4) {
    data[i] = data[i] ^ 255; // Invert Red
    data[i + 1] = data[i + 1] ^ 255; // Invert Green
    data[i + 2] = data[i + 2] ^ 255; // Invert Blue
  }
}
function draw() {
  video.style = "display:none";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  invertColors(imageData.data);

  // Update the canvas with the new data
  //ctx.putImageData(imageData, 0, 0);

  ctx.fillStyle = "rgb(0, 0, 0)";
  pixels.forEach((pix) => {
    pix.update();
    pix.draw();
  });

  requestAnimationFrame(draw);
}

const constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
  for (let i = 0; i < 2500; i++) {
    pixels.push(new Pixel());
  }
  console.log("here", pixels);
  draw();
}

function handleError(error) {
  console.log(
    "navigator.MediaDevices.getUserMedia error: ",
    error.message,
    error.name
  );
}

navigator.mediaDevices
  .getUserMedia(constraints)
  .then(handleSuccess)
  .catch(handleError);
