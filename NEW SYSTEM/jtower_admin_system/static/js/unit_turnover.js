function openModal(mode, btn) {
    const modal = document.getElementById('utoModal');
    const form = document.getElementById('utoForm');
    const btnSubmit = document.getElementById('submitBtn');
    const paper = document.querySelector('.paper');
    const dateInput = document.getElementById('to_date');
    const formattedDateSpan = document.getElementById('formatted_date');
    const towerSelect = document.getElementById('tower_floor');
    const formattedTowerSpan = document.getElementById('formatted_tower_floor');
    const unitTypeSelect = document.getElementById('unit_type');

    // 1. Reset to a known, editable state
    form.reset();
    paper.classList.remove('view-mode');
    btnSubmit.style.display = 'inline-block';
    formattedDateSpan.onclick = editDate;
    dateInput.style.display = 'inline-block';
    formattedDateSpan.style.display = 'none';
    formattedDateSpan.textContent = '';
    formattedTowerSpan.onclick = editTowerFloor;
    towerSelect.style.display = 'inline-block';
    formattedTowerSpan.style.display = 'none';
    formattedTowerSpan.innerHTML = '';
    unitTypeSelect.style.display = 'inline-block';

    // 2. Configure based on mode
    if (mode === 'create') {
        form.action = form.dataset.createUrl;
        btnSubmit.textContent = 'Save Record';
        
        const nextRef = btn.dataset.nextRef;
        document.getElementById('control_number').value = nextRef;
        document.getElementById('display_control_no').textContent = nextRef;
    } else { // 'edit' or 'view'
        const data = JSON.parse(btn.dataset.record);
        document.getElementById('control_number').value = data.control_number;
        document.getElementById('display_control_no').textContent = data.control_number;
        document.getElementById('unit_owner_name').value = data.unit_owner_name;
        document.getElementById('unit_number').value = data.unit_number;
        document.getElementById('tower_floor').value = data.tower_floor || '';
        document.getElementById('unit_type').value = data.unit_type;
        dateInput.value = data.to_date;
        
        // Update formatted display values (so they are ready if user prints immediately)
        formatTowerFloor();

        if (mode === 'edit') {
            form.action = `/unit-turnover/${data.id}/edit`;
            btnSubmit.textContent = 'Update Record';
            // In edit mode, we want the date input to be visible by default.
            // Keep inputs visible for editing
            towerSelect.style.display = 'inline-block';
            formattedTowerSpan.style.display = 'none';
            unitTypeSelect.style.display = 'inline-block';

            // Show date as formatted text initially (since value exists), click to edit
            formatDate();
        } else if (mode === 'view') {
            btnSubmit.style.display = 'none';
            form.action = '#';
            paper.classList.add('view-mode');
            // --- View-specific display logic to match print preview ---
            dateInput.style.display = 'none';
            formattedDateSpan.style.display = 'inline-block';

            towerSelect.style.display = 'none';
            formattedTowerSpan.style.display = 'inline-block';
            unitTypeSelect.style.display = 'none'; // Hide select arrow in view mode via CSS or display none

            if (data.to_date) {
                const date = new Date(data.to_date);
                const adjustedDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                formattedDateSpan.textContent = adjustedDate.toLocaleDateString('en-US', options);
            } else {
                formattedDateSpan.textContent = '____________';
            }
            formattedDateSpan.onclick = null; // Disable click-to-edit in view mode
            formattedTowerSpan.onclick = null;
        }
    }
    modal.classList.add('show');
}

function closeModal() {
    document.getElementById('utoModal').classList.remove('show');
}

function formatDate() {
    const dateInput = document.getElementById('to_date');
    const formattedDateSpan = document.getElementById('formatted_date');
    
    if (dateInput.value) {
        // Adjust for timezone to prevent off-by-one day errors
        const date = new Date(dateInput.value);
        const adjustedDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        formattedDateSpan.textContent = adjustedDate.toLocaleDateString('en-US', options);
    } else {
        formattedDateSpan.textContent = '____________';
    }

    // Hide input, show text
    dateInput.style.display = 'none';
    formattedDateSpan.style.display = 'inline-block';
}

function editDate() {
    // Prevent editing in view mode
    if(document.querySelector('.paper').classList.contains('view-mode')) return;

    const dateInput = document.getElementById('to_date');
    const formattedDateSpan = document.getElementById('formatted_date');
    formattedDateSpan.style.display = 'none';
    dateInput.style.display = 'inline-block';
    if(dateInput.showPicker) dateInput.showPicker();
    dateInput.focus();
}

function formatTowerFloor() {
    const select = document.getElementById('tower_floor');
    const span = document.getElementById('formatted_tower_floor');
    
    if (select.value) {
        // Converts "1st Floor" to "1<sup>st</sup> Floor"
        span.innerHTML = select.value.replace(/(\d+)(st|nd|rd|th)/gi, '$1<sup>$2</sup>');
    } else {
        span.innerHTML = '____________';
    }
}

function editTowerFloor() {
    if(document.querySelector('.paper').classList.contains('view-mode')) return;
    
    const select = document.getElementById('tower_floor');
    const span = document.getElementById('formatted_tower_floor');
    span.style.display = 'none';
    select.style.display = 'inline-block';
    select.focus();
}