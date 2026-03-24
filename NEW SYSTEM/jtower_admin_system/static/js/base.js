  // Clock
  function tick() {
    const d = new Date();
    document.getElementById('topbar-clock').textContent =
      d.toLocaleDateString('en-PH',{weekday:'short',year:'numeric',month:'short',day:'numeric'}) +
      ' · ' + d.toLocaleTimeString('en-PH',{hour:'2-digit',minute:'2-digit'});
  }
  tick(); setInterval(tick, 1000);

  // Delete confirmation
  function confirmDelete(url) {
    if (confirm("Are you sure you want to delete this record? This action cannot be undone.")) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = url;
        document.body.appendChild(form);
        form.submit();
    }
  }
