
function previewFile(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('dropContent').style.display = 'none';
      const img = document.getElementById('previewImg');
      img.src = e.target.result;
      img.style.display = 'block';
      document.getElementById('dropArea').style.borderColor = '#C9A227';
    };
    reader.readAsDataURL(input.files[0]);
  }
}
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('dropArea').style.borderColor = '#D1D5DB';
  document.getElementById('dropArea').style.background = '#F8FAFC';
  const dt = e.dataTransfer;
  const input = document.getElementById('fileInput');
  input.files = dt.files;
  previewFile(input);
}
