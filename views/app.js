document.addEventListener("DOMContentLoaded", () => {
    loadProgrammes();
});

async function loadProgrammes() {
    const container = document.getElementById('programmes-container');
    
    try {
        
        const response = await fetch('/api/programmes');
        const programmes = await response.json();
        
        container.innerHTML = ''; // Clear loading text
        
        if (programmes.length === 0) {
            container.innerHTML = '<p>No programmes are currently available. Please check back later.</p>';
            return;
        }

        // Loop through each programme and create HTML for it
        programmes.forEach(prog => {
            const card = document.createElement('div');
            card.className = 'programme-card';
            card.innerHTML = `
                <h2>${prog.title} (${prog.level})</h2>
                <p>${prog.description}</p>
                <button onclick="showInterestForm('${prog.id}', '${prog.title}')" aria-label="Register interest in ${prog.title}">Register Interest</button>
                <div id="form-container-${prog.id}"></div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = '<p>Error loading programmes. Please try again.</p>';
        console.error(error);
    }
}

// Shows the form when a student clicks "Register Interest"
function showInterestForm(programmeId, programmeTitle) {
    const formContainer = document.getElementById(`form-container-${programmeId}`);
    
    // Prevent opening multiple forms
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
            
            <button type="submit">Submit Registration</button>
        </form>
    `;
    
    // Accessibility: Move keyboard focus to the first input of the new form
    document.getElementById(`firstName-${programmeId}`).focus();
}

async function submitInterest(event, programmeId) {
    event.preventDefault(); // Prevent page reload
    
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
            const formContainer = document.getElementById(`form-container-${programmeId}`);
            formContainer.innerHTML = '<p style="color: green; font-weight: bold;">Thank you! Your interest has been registered.</p>';
        } else {
            alert('Failed to register interest. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
}