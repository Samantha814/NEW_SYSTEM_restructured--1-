function openExplanationModal(mode, buttonEl = null) {
  const modal = document.getElementById('explanationModal');
  const form = document.getElementById('explanationForm');
  const titleEl = document.getElementById('explanationModalTitle');
  const submitBtn = document.getElementById('submitBtn');
  const container = modal.querySelector('.modal-split-container');
  const headerPrintBtn = document.getElementById('headerPrintBtn');

  form.reset();
  container.classList.remove('view-mode');
  headerPrintBtn.style.display = 'none';

  if (mode === 'create') {
    titleEl.textContent = 'Create Explanation Report';
    form.action = form.dataset.createUrl;
    submitBtn.textContent = '💾 Save Report';
    // Defaults
    const btnData = buttonEl.dataset;
    form.querySelector('#ex_ref').value = btnData.nextRef;
    form.querySelector('#ex_date').value = new Date().toISOString().split('T')[0];
    form.querySelector('#ex_prepared').value = `${btnData.fullName}\n${btnData.role}`;
    form.querySelector('#ex_location').value = "";
    form.querySelector('#ex_desc').value = "";
    form.querySelector('#ex_received').value = "";
    form.querySelector('#ex_dept').value = "Accounting";

  } else if (mode === 'edit' && buttonEl) {
    const data = JSON.parse(buttonEl.dataset.record);
    titleEl.textContent = 'Edit Explanation Report';
    form.action = `${form.dataset.editUrlBase}/${data.id}/edit`;
    submitBtn.textContent = '💾 Save Changes';
    
    form.querySelector('#ex_ref').value = data.ref_number || '';
    form.querySelector('#ex_date').value = data.date || '';
    form.querySelector('#ex_location').value = data.location || '';
    form.querySelector('#ex_dept').value = data.department || 'Accounting';
    form.querySelector('#ex_desc').value = data.description || '';
    form.querySelector('#ex_prepared').value = data.prepared_by || '';
    form.querySelector('#ex_received').value = data.received_by || '';

  } else if (mode === 'view' && buttonEl) {
    const data = JSON.parse(buttonEl.dataset.record);
    titleEl.textContent = 'View Explanation Report';
    container.classList.add('view-mode');
    headerPrintBtn.style.display = 'block';
    
    // Populate form to drive preview
    form.querySelector('#ex_ref').value = data.ref_number || '';
    form.querySelector('#ex_date').value = data.date || '';
    form.querySelector('#ex_location').value = data.location || '';
    form.querySelector('#ex_dept').value = data.department || '';
    form.querySelector('#ex_desc').value = data.description || '';
    form.querySelector('#ex_prepared').value = data.prepared_by || '';
    form.querySelector('#ex_received').value = data.received_by || '';
  }

  updateExplanationPreview();
  modal.classList.add('show');
}

function closeExplanationModal() {
  document.getElementById('explanationModal').classList.remove('show');
}

function updateExplanationPreview() {
  document.getElementById('p_ex_ref').innerText = document.getElementById('ex_ref').value;
  
  const dateVal = document.getElementById('ex_date').value;
  const dateString = dateVal ? new Date(dateVal).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }) : '';
  document.getElementById('p_ex_date').innerText = dateString;

  document.getElementById('p_ex_location').innerText = document.getElementById('ex_location').value;
  document.getElementById('p_ex_dept').innerText = document.getElementById('ex_dept').value;
  document.getElementById('p_ex_desc').innerHTML = document.getElementById('ex_desc').value.replace(/\n/g, "<br>");

  const prepared_parts = document.getElementById('ex_prepared').value.split('\n');
  document.getElementById('p_ex_prepared_name').innerText = prepared_parts[0] || '';
  document.getElementById('p_ex_prepared_pos').innerText = prepared_parts.slice(1).join('\n');

  const received_parts = document.getElementById('ex_received').value.split('\n');
  document.getElementById('p_ex_received_name').innerText = received_parts[0] || '';
  document.getElementById('p_ex_received_pos').innerText = received_parts.slice(1).join('\n');
}