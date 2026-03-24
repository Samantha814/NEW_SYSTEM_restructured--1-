
function openProgressModal(mode, buttonEl = null) {
  const modal = document.getElementById('progressModal');
  const form = document.getElementById('progressForm');
  const titleEl = document.getElementById('progressModalTitle');
  const submitBtn = document.getElementById('submitBtn');
  const container = modal.querySelector('.modal-split-container');
  const headerPrintBtn = document.getElementById('headerPrintBtn');

  form.reset();
  container.classList.remove('view-mode');
  headerPrintBtn.style.display = 'none';

  if (mode === 'create') {
    titleEl.textContent = 'Create Progress Report';
    form.action = form.dataset.createUrl;
    submitBtn.textContent = '💾 Save Report';
    
    // Defaults
    const btnData = buttonEl.dataset;
    form.querySelector('#pr_ref').value = btnData.nextRef || ""; 
    form.querySelector('#pr_date').value = new Date().toISOString().split('T')[0];
    form.querySelector('#pr_emp_name').value = btnData.fullName || '';
    form.querySelector('#pr_emp_pos').value = btnData.role || '';
    
    // Clear text areas
    ['pr_period', 'pr_sec1', 'pr_sec2', 'pr_sec3', 'pr_sec4', 'pr_sec5', 'pr_remarks', 'pr_reviewer', 'pr_reviewer_pos'].forEach(id => {
      form.querySelector(`#${id}`).value = '';
    });

  } else if (mode === 'edit' && buttonEl) {
    const data = JSON.parse(buttonEl.dataset.record);
    titleEl.textContent = 'Edit Progress Report';
    form.action = `${form.dataset.editUrlBase}/${data.id}/edit`;
    submitBtn.textContent = '💾 Save Changes';
    
    form.querySelector('#pr_ref').value = data.ref_number || '';
    form.querySelector('#pr_date').value = data.date || '';
    form.querySelector('#pr_period').value = data.reporting_period || '';
    form.querySelector('#pr_emp_name').value = data.employee_name || '';
    form.querySelector('#pr_emp_pos').value = data.employee_position || '';
    form.querySelector('#pr_dept').value = data.department || 'Accounting';
    
    form.querySelector('#pr_sec1').value = data.work_accomplishments || '';
    form.querySelector('#pr_sec2').value = data.tasks_completed || '';
    form.querySelector('#pr_sec3').value = data.issues_concerns || '';
    form.querySelector('#pr_sec4').value = data.actions_taken || '';
    form.querySelector('#pr_sec5').value = data.planned_tasks || '';
    form.querySelector('#pr_remarks').value = data.remarks || '';
    form.querySelector('#pr_reviewer').value = data.reviewed_by || '';
    form.querySelector('#pr_reviewer_pos').value = data.reviewer_position || '';

  } else if (mode === 'view' && buttonEl) {
    const data = JSON.parse(buttonEl.dataset.record);
    titleEl.textContent = 'View Progress Report';
    container.classList.add('view-mode');
    headerPrintBtn.style.display = 'block';
    
    form.querySelector('#pr_ref').value = data.ref_number || '';
    form.querySelector('#pr_date').value = data.date || '';
    form.querySelector('#pr_period').value = data.reporting_period || '';
    form.querySelector('#pr_emp_name').value = data.employee_name || '';
    form.querySelector('#pr_emp_pos').value = data.employee_position || '';
    form.querySelector('#pr_dept').value = data.department || '';
    
    form.querySelector('#pr_sec1').value = data.work_accomplishments || '';
    form.querySelector('#pr_sec2').value = data.tasks_completed || '';
    form.querySelector('#pr_sec3').value = data.issues_concerns || '';
    form.querySelector('#pr_sec4').value = data.actions_taken || '';
    form.querySelector('#pr_sec5').value = data.planned_tasks || '';
    form.querySelector('#pr_remarks').value = data.remarks || '';
    form.querySelector('#pr_reviewer').value = data.reviewed_by || '';
    form.querySelector('#pr_reviewer_pos').value = data.reviewer_position || '';
  }

  updateProgressPreview();
  modal.classList.add('show');
}

function closeProgressModal() {
  document.getElementById('progressModal').classList.remove('show');
}

function updateProgressPreview() {
  // Inputs
  const empName = document.getElementById('pr_emp_name').value || '';
  const empPos = document.getElementById('pr_emp_pos').value || '';
  const reviewer = document.getElementById('pr_reviewer').value || '';
  const reviewerPos = document.getElementById('pr_reviewer_pos').value || '';
  const sec1 = document.getElementById('pr_sec1').value;
  const sec2 = document.getElementById('pr_sec2').value;
  const sec3 = document.getElementById('pr_sec3').value;
  const sec4 = document.getElementById('pr_sec4').value;
  const sec5 = document.getElementById('pr_sec5').value;
  const rem = document.getElementById('pr_remarks').value;

  // Update Preview DOM
  const dateVal = document.getElementById('pr_date').value;
  const dateString = dateVal ? new Date(dateVal).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }) : '';
  document.getElementById('p_pr_ref').innerText = document.getElementById('pr_ref').value || '';
  document.getElementById('p_pr_date').innerText = dateString;

  document.getElementById('p_pr_period').innerText = document.getElementById('pr_period').value;
  document.getElementById('p_pr_dept').innerText = document.getElementById('pr_dept').value;
  document.getElementById('p_pr_emp_name').innerText = empName;
  document.getElementById('p_pr_emp_pos').innerText = empPos;

  // Sections
  document.getElementById('p_pr_sec1').innerHTML = sec1.replace(/\n/g, "<br>");
  document.getElementById('p_pr_sec2').innerHTML = sec2.replace(/\n/g, "<br>");
  document.getElementById('p_pr_sec3').innerHTML = sec3.replace(/\n/g, "<br>");
  document.getElementById('p_pr_sec4').innerHTML = sec4.replace(/\n/g, "<br>");
  document.getElementById('p_pr_sec5').innerHTML = sec5.replace(/\n/g, "<br>");
  document.getElementById('p_pr_remarks').innerHTML = rem.replace(/\n/g, "<br>");

  // Footer
  document.getElementById('p_pr_submit_name').innerText = empName;
  document.getElementById('p_pr_submit_pos').innerText = empPos;
  document.getElementById('p_pr_reviewer').innerText = reviewer;
  document.getElementById('p_pr_reviewer_pos').innerText = reviewerPos;
}
