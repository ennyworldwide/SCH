// views/app.js

let allProgrammes = [];

document.addEventListener("DOMContentLoaded", () => {
    loadProgrammes();
    document.getElementById('search-input').addEventListener('input', renderProgrammes);
    document.getElementById('level-filter').addEventListener('change', renderProgrammes);
});

function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
}

// --- NEW UI POLISH: Toast Notification System ---
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);

    // Remove the toast after 3.5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500); // Wait for fade out animation
    }, 3500);
}

async function loadProgrammes() {
    const container = document.getElementById('programmes-container');
    // Show spinner while fetching
    container.innerHTML = '<div class="spinner"></div>';
    
    try {
        const response = await fetch('/api/programmes');
        allProgrammes = await response.json();
        renderProgrammes(); 
    } catch (error) {
        container.innerHTML = '<p style="color: red;">Error loading programmes. Please try again.</p>';
        showToast("Failed to connect to the server.", "error");
    }
}

function renderProgrammes() {
    const container = document.getElementById('programmes-container');
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    const levelFilter = document.getElementById('level-filter').value;

    container.innerHTML = '';

    const filteredProgrammes = allProgrammes.filter(prog => {
        const matchesSearch = prog.title.toLowerCase().includes(searchQuery) || prog.description.toLowerCase().includes(searchQuery);
        const matchesLevel = levelFilter === "All" || prog.level === levelFilter;
        return matchesSearch && matchesLevel;
    });

    if (filteredProgrammes.length === 0) {
        container.innerHTML = '<p>No programmes match your search criteria.</p>';
        return;
    }

    filteredProgrammes.forEach(prog => {
        const safeId = escapeHTML(prog.id);
        const card = document.createElement('div');
        card.className = 'programme-card';
        card.innerHTML = `
            <span class="badge">${escapeHTML(prog.level)}</span>
            <h2>${escapeHTML(prog.title)}</h2>
            <p>${escapeHTML(prog.description)}</p>
            
            <div style="display: flex; gap: 10px; margin-top: 15px;">
                <button class="btn-outline" onclick="loadModules('${safeId}')">View Modules</button>
                <button onclick="showInterestForm('${safeId}', '${escapeHTML(prog.title)}')" aria-label="Register interest">Register Interest</button>
            </div>
            
            <div id="modules-container-${safeId}"></div>
            <div id="form-container-${safeId}"></div>
        `;
        container.appendChild(card);
    });
}

async function loadModules(programmeId) {
    const container = document.getElementById(`modules-container-${programmeId}`);
    
    if (container.innerHTML !== "") {
        container.innerHTML = "";
        return;
    }

    // Show spinner while fetching modules
    container.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; margin: 10px 0;"></div>';

    try {
        const response = await fetch(`/api/programmes/${programmeId}/modules`);
        const modules = await response.json();

        if (modules.length === 0) {
            container.innerHTML = `<div class="modules-list"><p>No modules have been assigned to this programme yet.</p></div>`;
            return;
        }

        let modulesHTML = `<div class="modules-list"><h3>Course Modules</h3><ul>`;
        modules.forEach(mod => {
            modulesHTML += `<li><strong>Year ${escapeHTML(mod.yearOfStudy.toString())}:</strong> ${escapeHTML(mod.title)}</li>`;
        });
        modulesHTML += `</ul></div>`;
        
        container.innerHTML = modulesHTML;
    } catch (error) {
        container.innerHTML = "<p style='color: red;'>Error loading modules.</p>";
        showToast("Failed to load modules.", "error");
    }
}

function showInterestForm(programmeId, programmeTitle) {
    const formContainer = document.getElementById(`form-container-${programmeId}`);
    if (formContainer.innerHTML !== "") return; 

    formContainer.innerHTML = `
        <form onsubmit="submitInterest(event, '${programmeId}')">
            <h3>Register for ${programmeTitle}</h3>
            <label for="firstName-${programmeId}">First Name:</label>
            <input type="text" id="firstName-${programmeId}" required>
            
            <label for="lastName-${programmeId}">Last Name:</label>
            <input type="text" id="lastName-${programmeId}" required>
            
            <label for="email-${programmeId}">Email:</label>
            <input type="email" id="email-${programmeId}" required>
            
            <button type="submit" id="submit-btn-${programmeId}">Submit Registration</button>
        </form>
    `;
    document.getElementById(`firstName-${programmeId}`).focus();
}

async function submitInterest(event, programmeId) {
    event.preventDefault(); 
    
    // Disable the button to prevent double-clicks
    const submitBtn = document.getElementById(`submit-btn-${programmeId}`);
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    const data = {
        firstName: document.getElementById(`firstName-${programmeId}`).value,
        lastName: document.getElementById(`lastName-${programmeId}`).value,
        email: document.getElementById(`email-${programmeId}`).value,
        programmeId: programmeId
    };

    try {
        const response = await fetch('/api/students/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // SUCCESS: Show green toast and clear the form
            showToast("Thank you! Your interest has been registered.", "success");
            document.getElementById(`form-container-${programmeId}`).innerHTML = '';
        } else {
            // ERROR: Show red toast and reset button
            showToast("Failed to register interest. Please try again.", "error");
            submitBtn.disabled = false;
            submitBtn.textContent = "Submit Registration";
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showToast("Network error. Please try again.", "error");
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Registration";
    }
}