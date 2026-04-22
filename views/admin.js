// 1. Security Helper: Prevent Cross-Site Scripting (XSS)
function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
}

document.addEventListener("DOMContentLoaded", () => {
    loadAdminProgrammes();

    // 2. Handle Add New Programme Form
    document.getElementById('add-programme-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            title: document.getElementById('prog-title').value,
            level: document.getElementById('prog-level').value,
            description: document.getElementById('prog-desc').value
        };

        const response = await fetch('/api/admin/programmes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        // Security check
        if (response.status === 401) {
            window.location.href = '/login.html';
            return;
        }

        e.target.reset(); // Clear the form
        loadAdminProgrammes(); // Refresh the list
    });

    // 3. Handle Export Mailing List Button
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', async () => {
            const originalText = exportBtn.textContent;
            exportBtn.textContent = "Downloading...";
            exportBtn.disabled = true;

            try {
                const response = await fetch('/api/admin/students/export');
                
                // Security check
                if (response.status === 401) {
                    window.location.href = '/login.html';
                    return;
                }

                if (!response.ok) throw new Error("Export failed");

                // Download Logic (Convert to Blob, create invisible link, click, and clean up)
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = 'student_mailing_list.csv'; 
                document.body.appendChild(a);
                a.click();
                
                a.remove();
                window.URL.revokeObjectURL(url);

            } catch (error) {
                console.error('Download error:', error);
                alert("Failed to download the mailing list. Please try again.");
            } finally {
                // Reset the button
                exportBtn.textContent = originalText;
                exportBtn.disabled = false;
            }
        });
    }
});

// 4. Fetch and Display Programmes in the Table
async function loadAdminProgrammes() {
    const tbody = document.getElementById('admin-programmes-list');
    const response = await fetch('/api/admin/programmes');
    
    // Security check
    if (response.status === 401) {
        window.location.href = '/login.html';
        return;
    }

    const programmes = await response.json();
    tbody.innerHTML = '';

    programmes.forEach(prog => {
        const tr = document.createElement('tr');
        const statusClass = prog.isPublished ? 'published' : 'draft';
        const statusText = prog.isPublished ? 'Published' : 'Draft';
        
        tr.innerHTML = `
            <td>${escapeHTML(prog.title)}</td>
            <td>${escapeHTML(prog.level)}</td>
            <td class="${statusClass}">${statusText}</td>
            <td>
                <button class="btn-publish" onclick="togglePublish('${prog.id}')">
                    ${prog.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <button class="btn-delete" onclick="deleteProgramme('${prog.id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 5. Publish / Unpublish Toggle
async function togglePublish(id) {
    const response = await fetch(`/api/admin/programmes/${id}/publish`, { method: 'PUT' });
    
    // Security check
    if (response.status === 401) {
        window.location.href = '/login.html';
        return;
    }
    
    loadAdminProgrammes();
}

// 6. Delete Programme
async function deleteProgramme(id) {
    if(confirm("Are you sure you want to delete this programme?")) {
        const response = await fetch(`/api/admin/programmes/${id}`, { method: 'DELETE' });
        
        // Security check
        if (response.status === 401) {
            window.location.href = '/login.html';
            return;
        }
        
        loadAdminProgrammes();
    }
}