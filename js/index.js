let mediaRecorder;
let recordedChunks = [];
let startTime;
let timerInterval;

document.getElementById('startBtn').addEventListener('click', async () => {
  const stream = await navigator.mediaDevices.getDisplayMedia({video: true});
  mediaRecorder = new MediaRecorder(stream, {mimeType: 'video/webm'});

  mediaRecorder.ondataavailable = event => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = () => {
    mediaRecorder.stream.getVideoTracks().forEach(track => track.stop());
    clearInterval(timerInterval);

    const blob = new Blob(recordedChunks, {type: 'video/webm'});
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');

    downloadLink.href = url;
    downloadLink.download = 'recording.webm';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  };

  mediaRecorder.start();
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);

  document.getElementById('startBtn').style.display = 'none';
  document.getElementById('stopBtn').style.display = 'block';
});

document.getElementById('stopBtn').addEventListener('click', () => {
  mediaRecorder.stop();
  document.getElementById('startBtn').style.display = 'block';
  document.getElementById('stopBtn').style.display = 'none';
});

function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  const minutes = String(Math.floor(elapsedTime / 60)).padStart(2, '0');
  const seconds = String(elapsedTime % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `Recording Time: ${minutes}:${seconds}`;
}
