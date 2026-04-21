document.addEventListener("DOMContentLoaded", () => {
    loadAdminProgrammes();

    document.getElementById('add-programme-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const data = {
            title: document.getElementById('prog-title').value,
            level: document.getElementById('prog-level').value,
            description: document.getElementById('prog-desc').value
        };

        await fetch('/api/admin/programmes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        e.target.reset();
        loadAdminProgrammes(); // Refresh the list
    });
});

async function loadAdminProgrammes() {
    const tbody = document.getElementById('admin-programmes-list');
    const response = await fetch('/api/admin/programmes');
    const programmes = await response.json();
    
    tbody.innerHTML = '';

    programmes.forEach(prog => {
        const tr = document.createElement('tr');
        const statusClass = prog.isPublished ? 'published' : 'draft';
        const statusText = prog.isPublished ? 'Published' : 'Draft';
        
        tr.innerHTML = `
            <td>${prog.title}</td>
            <td>${prog.level}</td>
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

async function togglePublish(id) {
    await fetch(`/api/admin/programmes/${id}/publish`, { method: 'PUT' });
    loadAdminProgrammes();
}

async function deleteProgramme(id) {
    if(confirm("Are you sure you want to delete this programme?")) {
        await fetch(`/api/admin/programmes/${id}`, { method: 'DELETE' });
        loadAdminProgrammes();
    }
}