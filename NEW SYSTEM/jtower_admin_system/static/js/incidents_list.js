
function showImg(src) {
  document.getElementById('imgModalSrc').src = src;
  document.getElementById('imgModal').classList.add('show');
}

// Create Modal Functions
function openReportModal(mode, buttonEl = null) {
    const modal = document.getElementById('reportModal');
    const form = document.getElementById('reportForm');
    const titleEl = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');
    const container = document.querySelector('.modal-split-container');
    const headerPrintBtn = document.getElementById('headerPrintBtn');

    // Reset form and image preview for both modes
    form.reset();
    document.getElementById('p_images_container').innerHTML = '';
    document.getElementById('incident_images').value = '';
    container.classList.remove('view-mode');
    headerPrintBtn.style.display = 'none';

    if (mode === 'create') {
        titleEl.textContent = 'Create Incident Report';
        form.action = form.dataset.createUrl;

        // Set defaults for create mode
        document.getElementById('ref').value = buttonEl.dataset.nextRef || "";
        document.getElementById('date').value = buttonEl.dataset.today;
        document.getElementById('prepared').value = "";
        document.getElementById('received').value = "";
        document.getElementById('person_name').value = "";
        document.getElementById('description').value = "";

        submitBtn.textContent = 'Save to Database';

    } else if (mode === 'edit' && buttonEl) {
        const data = JSON.parse(buttonEl.dataset.record);
        titleEl.textContent = 'Edit Incident Report';
        form.action = `${form.dataset.editUrlBase}/${data.id}/edit`;
        
        // Populate the form
        document.getElementById('ref').value = data.ref_number || '';
        document.getElementById('date').value = data.date || '';
        document.getElementById('person_name').value = data.location || '';
        document.getElementById('incident_name').value = data.incident_title || '';
        document.getElementById('description').value = data.description || '';
        document.getElementById('prepared').value = data.prepared_by || '';
        document.getElementById('received').value = data.received_by || '';

        // Handle image preview for existing image
        if (data.image_path) {
            previewImages({
                target: { files: [] } // Pass a mock event
            }, `/static/uploads/${data.image_path}`);
        }

        submitBtn.textContent = 'Save Changes';

    } else if (mode === 'view' && buttonEl) {
        const data = JSON.parse(buttonEl.dataset.record);
        titleEl.textContent = 'View Incident Report';
        container.classList.add('view-mode');
        headerPrintBtn.style.display = 'block';

        // Populate form (hidden) to drive preview
        document.getElementById('ref').value = data.ref_number || '';
        document.getElementById('date').value = data.date || '';
        document.getElementById('person_name').value = data.location || '';
        document.getElementById('incident_name').value = data.incident_title || '';
        document.getElementById('description').value = data.description || '';
        document.getElementById('prepared').value = data.prepared_by || '';
        document.getElementById('received').value = data.received_by || '';

        // Handle image preview
        if (data.image_path) {
            previewImages({
                target: { files: [] }
            }, `/static/uploads/${data.image_path}`);
        }
    }

    updatePreview();
    modal.classList.add('show');
}

function closeReportModal() {
  document.getElementById('reportModal').classList.remove('show');
}

function createImageInPreview(src) {
    const container = document.getElementById("p_images_container");
    const wrapper = document.createElement("div");
    wrapper.className = "image-wrapper";
    const img = document.createElement("img");
    img.src = src;
    wrapper.appendChild(img);
    container.appendChild(wrapper);
    enableResize(img);
}

// --- User Provided JS Logic ---
function capitalizeFirstLetter(el){
    if(el.value.length > 0){
        el.value = el.value.charAt(0).toUpperCase() + el.value.slice(1);
    }
}
function formatDateToWords(dateString){
    if(!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "long", day: "2-digit", year: "numeric"
    });
}
function updatePreview(){
    // Using IDs directly as per user script, but ensuring they exist
    const ref = document.getElementById('ref');
    const date = document.getElementById('date');
    const person_name = document.getElementById('person_name');
    const incident_name = document.getElementById('incident_name');
    const description = document.getElementById('description');
    const prepared = document.getElementById('prepared');
    const received = document.getElementById('received');

    if(document.getElementById('p_ref')) document.getElementById('p_ref').textContent = ref.value;
    if(document.getElementById('p_date')) document.getElementById('p_date').textContent = formatDateToWords(date.value);
    if(document.getElementById('p_person_name')) document.getElementById('p_person_name').textContent = person_name.value;
    if(document.getElementById('p_incident_title')) document.getElementById('p_incident_title').textContent = incident_name.value;
    if(document.getElementById('p_description')) document.getElementById('p_description').innerHTML = description.value.replace(/\n/g,"<br>");
    if(document.getElementById('p_prepared')) document.getElementById('p_prepared').innerHTML = prepared.value.replace(/\n/g,"<br>");
    if(document.getElementById('p_received')) document.getElementById('p_received').innerHTML = received.value.replace(/\n/g,"<br>");
}
function previewImages(event, existingImageUrl = null){
    const container = document.getElementById("p_images_container");
    container.innerHTML = "";

    const files = Array.from(event.target.files);
    if (files.length > 0) {
        files.forEach(file => {
            createImageInPreview(URL.createObjectURL(file));
        });
    } else if (existingImageUrl) {
        createImageInPreview(existingImageUrl);
    }
}

// Enable Word-style corner resizing
function enableResize(img){
    const wrapper = img.parentElement;
    const corners = ["nw","ne","sw","se"];
    
    // Create 4 corner handles
    corners.forEach(corner=>{
        const handle = document.createElement("div");
        handle.className = "handle " + corner;
        wrapper.appendChild(handle);
    });

    // Select image on click
    img.addEventListener("click", e=>{
        document.querySelectorAll(".image-wrapper").forEach(w => w.classList.remove("selected"));
        wrapper.classList.add("selected");
    });

    const handles = wrapper.querySelectorAll(".handle");
    
    handles.forEach(handle=>{
        handle.addEventListener("mousedown", function(e){
            e.preventDefault();
            const startX = e.clientX;
            const startY = e.clientY;
            const startW = img.offsetWidth;
            const startH = img.offsetHeight;

            function doDrag(e){
                let dx = e.clientX - startX;
                let dy = e.clientY - startY;
                let newW = startW;
                let newH = startH;

                // Adjust width based on corner
                if(handle.classList.contains("ne") || handle.classList.contains("se")){
                    newW = startW + dx;
                }
                if(handle.classList.contains("nw") || handle.classList.contains("sw")){
                    newW = startW - dx;
                }

                // Adjust height based on corner
                if(handle.classList.contains("sw") || handle.classList.contains("se")){
                    newH = startH + dy;
                }
                if(handle.classList.contains("nw") || handle.classList.contains("ne")){
                    newH = startH - dy;
                }

                // Minimum size
                if(newW > 20) img.style.width = newW + "px";
                if(newH > 20) img.style.height = newH + "px";
            }

            function stopDrag(){
                window.removeEventListener("mousemove", doDrag);
                window.removeEventListener("mouseup", stopDrag);
            }

            window.addEventListener("mousemove", doDrag);
            window.addEventListener("mouseup", stopDrag);
        });
    });
}
