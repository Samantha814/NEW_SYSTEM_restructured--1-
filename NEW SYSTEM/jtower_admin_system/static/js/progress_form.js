
  const pctInput = document.querySelector('[name="progress_pct"]');
  const bar = document.getElementById('pct-bar');
  pctInput.addEventListener('input', () => {
    bar.style.width = pctInput.value + '%';
    const v = parseInt(pctInput.value);
    bar.style.background = v < 40 ? '#EF4444' : v < 70 ? '#F59E0B' : '#10B981';
  });
