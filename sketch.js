
let poseModelURL = 'https://teachablemachine.withgoogle.com/models/gRB6FIJ-Y/';

let model, video, label = "Calibrating", confidence = 0.0;
let osc;

async function setup() {
  createCanvas(640, 520);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  osc = new p5.Oscillator('sine');
  osc.start();
  osc.amp(0); // Muted by default

  model = await tmPose.load(poseModelURL + 'model.json', poseModelURL + 'metadata.json');
  classifyPose();
}

async function classifyPose() {
  const { posenetOutput } = await model.estimatePose(video.elt);
  const prediction = await model.predict(posenetOutput);
  const best = prediction.reduce((a, b) => (b.probability > a.probability ? b : a));
  label = best.className;
  confidence = best.probability;
  modulateAudio();
  requestAnimationFrame(classifyPose);
}

function draw() {
  background(0);
  image(video, 0, 0, 640, 480);
  fill(255);
  textSize(20);
  text(label + " " + nf(confidence * 100, 1, 1) + "%", 10, 505);
}

function modulateAudio() {
  osc.freq(200 + confidence * 600, 0.1);
  osc.amp(confidence * 0.5, 0.1);
}

function mousePressed() {
  userStartAudio(); // browsers block sound until you click
}
