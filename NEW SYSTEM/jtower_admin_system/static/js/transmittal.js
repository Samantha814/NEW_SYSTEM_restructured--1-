
  function openTransmittalModal(mode, buttonEl = null) {
    const modal = document.getElementById('transmittalModal');
    const form = document.getElementById('transmittalForm');
    const titleEl = document.getElementById('transmittalModalTitle');
    const submitBtn = document.getElementById('submitBtn');
    const container = modal.querySelector('.modal-split-container');
    const headerPrintBtn = document.getElementById('headerPrintBtn');
    const imageContainer = document.getElementById('p_tm_images_container');

    form.reset();
    container.classList.remove('view-mode');
    headerPrintBtn.style.display = 'none';
    imageContainer.innerHTML = '';

    if (mode === 'create') {
      titleEl.textContent = 'Create Transmittal Letter';
      form.action = form.dataset.createUrl;
      submitBtn.textContent = '💾 Save Transmittal';
      const btnData = buttonEl.dataset;
      form.querySelector('#tm_ref').value = btnData.nextRef;
      form.querySelector('#tm_date').value = btnData.today;
      form.querySelector('#tm_from_party').value = "Finance & Accounting Management";
      form.querySelector('#tm_prepared_by').value = `${btnData.fullName}\n${btnData.role}`;
    } else if (mode === 'edit' && buttonEl) {
      const data = JSON.parse(buttonEl.dataset.record);
      titleEl.textContent = 'Edit Transmittal Letter';
      form.action = `${form.dataset.editUrlBase}/${data.id}/edit`;
      submitBtn.textContent = '💾 Save Changes';
      form.querySelector('#tm_ref').value = data.ref_number || '';
      form.querySelector('#tm_subject').value = data.subject || '';
      form.querySelector('#tm_date').value = data.date || '';
      form.querySelector('#tm_to_party').value = data.to_party || '';
      form.querySelector('#tm_from_party').value = data.from_party || '';
      form.querySelector('#tm_remarks').value = data.remarks || '';
      form.querySelector('#tm_prepared_by').value = data.prepared_by || '';
      form.querySelector('#tm_received_by').value = data.received_by || '';

      if (data.image_path) {
        previewTransmittalImages({
            target: { files: [] }
        }, `/static/uploads/${data.image_path}`);
      }
    } else if (mode === 'view' && buttonEl) {
      const data = JSON.parse(buttonEl.dataset.record);
      titleEl.textContent = 'View Transmittal Letter';
      container.classList.add('view-mode');
      headerPrintBtn.style.display = 'block';
      // Populate form to drive preview
      form.querySelector('#tm_subject').value = data.subject || '';
      form.querySelector('#tm_date').value = data.date || '';
      form.querySelector('#tm_to_party').value = data.to_party || '';
      form.querySelector('#tm_from_party').value = data.from_party || '';
      form.querySelector('#tm_remarks').value = data.remarks || '';
      form.querySelector('#tm_prepared_by').value = data.prepared_by || '';
      form.querySelector('#tm_received_by').value = data.received_by || '';

      if (data.image_path) {
        previewTransmittalImages({
            target: { files: [] }
        }, `/static/uploads/${data.image_path}`);
      }
    }
    
    updateTransmittalPreview();
    modal.classList.add('show');
  }

  function closeTransmittalModal() {
    document.getElementById('transmittalModal').classList.remove('show');
  }

  function updateTransmittalPreview() {
    const dateVal = document.getElementById('tm_date').value;
    const dateString = dateVal ? new Date(dateVal).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }) : '';
    document.getElementById('p_tm_date').innerText = dateString;

    document.getElementById('p_tm_subject').innerText = document.getElementById('tm_subject').value;
    document.getElementById('p_tm_from_party').innerText = document.getElementById('tm_from_party').value;
    document.getElementById('p_tm_remarks').innerHTML = document.getElementById('tm_remarks').value.replace(/\n/g, "<br>");

    const prepared_parts = document.getElementById('tm_prepared_by').value.split('\n');
    document.getElementById('p_tm_prepared_by_name').innerText = prepared_parts[0] || '';
    document.getElementById('p_tm_prepared_by_pos').innerText = prepared_parts.slice(1).join('\n');

    const received_parts = document.getElementById('tm_received_by').value.split('\n');
    document.getElementById('p_tm_received_by_name').innerText = received_parts[0] || '';
    document.getElementById('p_tm_received_by_pos').innerText = received_parts.slice(1).join('\n');
  }

  function previewTransmittalImages(event, existingImageUrl = null){
    const container = document.getElementById("p_tm_images_container");
    container.innerHTML = "";

    const files = Array.from(event.target.files);
    if (files.length > 0) {
        files.forEach(file => {
            createImageInTransmittalPreview(URL.createObjectURL(file));
        });
    } else if (existingImageUrl) {
        createImageInTransmittalPreview(existingImageUrl);
    }
  }

  function createImageInTransmittalPreview(src) {
    const container = document.getElementById("p_tm_images_container");
    const wrapper = document.createElement("div");
    wrapper.className = "image-wrapper";
    const img = document.createElement("img");
    img.src = src;
    wrapper.appendChild(img);
    container.appendChild(wrapper);
    enableResize(img);
  }

  function enableResize(img){
    const wrapper = img.parentElement;
    const corners = ["nw","ne","sw","se"];
    
    corners.forEach(corner=>{
        const handle = document.createElement("div");
        handle.className = "handle " + corner;
        wrapper.appendChild(handle);
    });

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
                if(handle.classList.contains("ne") || handle.classList.contains("se")){ newW = startW + dx; }
                if(handle.classList.contains("nw") || handle.classList.contains("sw")){ newW = startW - dx; }
                if(handle.classList.contains("sw") || handle.classList.contains("se")){ newH = startH + dy; }
                if(handle.classList.contains("nw") || handle.classList.contains("ne")){ newH = startH - dy; }
                if(newW > 20) img.style.width = newW + "px";
                if(newH > 20) img.style.height = newH + "px";
            }
            function stopDrag(){ window.removeEventListener("mousemove", doDrag); window.removeEventListener("mouseup", stopDrag); }
            window.addEventListener("mousemove", doDrag); window.addEventListener("mouseup", stopDrag);
        });
    });
  }
