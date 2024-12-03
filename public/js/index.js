function clearFormFields() {
    document.querySelectorAll('input, select, textarea').forEach(field => {
        if (field.type === 'select-one') {
            field.selectedIndex = 0; // Reset select fields to the first option
        } else {
            field.value = ''; // Clear input and textarea fields
        }
    });
}

flatpickr("#dateOfBirth", {
    dateFormat: "Y-m-d", // Date format
    altInput: true, // Show a readable date input
    altFormat: "F j, Y", 
    maxDate: new Date().setFullYear(new Date().getFullYear() - 18) // Set maxDate to 18 years ago
});

/**
 * Collects form data, including grades for each education entry.
 */
function collectFormData() {
    const formData = {
        personalDetails: {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
            dateOfBirth: document.getElementById('dateOfBirth').value,
            gender: document.getElementById('gender').value,
            maritalStatus: document.getElementById('maritalStatus').value
        },
        education: [],
        workExperience: [],
        workReference: [],
        skills: [],
    };

    // Collect education data
    const educationItems = document.querySelectorAll('.education');
    educationItems.forEach((item) => {
        const educationData = {
            school: item.querySelector('.school').value,
            level: item.querySelector('.level').value,
            duration: item.querySelector('.duration').value,
            grades: []
        };

        // Collect grades for this education entry
        const gradeContainers = item.querySelectorAll('.grade-entry');
        gradeContainers.forEach((grade) => {
            const subject = grade.querySelector('.grade-subject').value;
            const score = grade.querySelector('.grade-score').value;
            educationData.grades.push({
                subject: subject,
                score: score
            });
        });

        formData.education.push(educationData);
    });

    // Collect work experience data
    const experienceItems = document.querySelectorAll('.work-experience');
    experienceItems.forEach((item) => {
        formData.workExperience.push({
            position: item.querySelector('.position').value,
            company: item.querySelector('.company').value,
            duration: item.querySelector('.duration').value,
            responsibility: item.querySelector('.responsibility').value
        });
    });

    // Collect work reference data
    const referenceItems = document.querySelectorAll('.work-reference');
    referenceItems.forEach((item) => {
        formData.workReference.push({
            position: item.querySelector('.position').value,
            company: item.querySelector('.company').value,
            duration: item.querySelector('.duration').value,
            contactName: item.querySelector('.contact-name').value,
            contactSurname: item.querySelector('.contact-surname').value,
            contactEmail: item.querySelector('.contact-email').value,
            contactPhone: item.querySelector('.contact-phone').value,
            contactPosition: item.querySelector('.contact-position').value
        });
    });

    // Collect skills data
    const skillInputs = document.querySelectorAll('.skill');
    skillInputs.forEach((input) => {
        if (input.value.trim() !== "") {
            formData.skills.push(input.value.trim());
        }
    });

    return formData;
}

// Function to send form data to backend
function sendData(formData) {
    console.log(formData);
    fetch('/generate-cv', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob(); // Change to blob() instead of json()
    })
    .then(blob => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        // Create a temporary link element
        const a = document.createElement('a');
        a.href = url;
        // Set the download filename
        a.download = `${formData.personalDetails.name.toLowerCase().replace(/\s+/g, '_')}.pdf`;
        // Append to body, click, and remove
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    })
    .catch(error => {
        console.error('Error:', error);
        // Add better error handling here, perhaps show an error message to the user
        alert('Failed to generate CV. Please try again.');
    })
    .finally(() => {
        // Re-enable the button and hide the loader
        const saveButton = document.getElementById('save');
        saveButton.disabled = false;
        document.getElementById('save-loader').classList.add('hidden');
        document.getElementById('save-text').classList.remove('hidden');
    });
}

// Event listener for submit button click
document.getElementById('save').addEventListener('click', function() {
    const saveButton = document.getElementById('save');
    const saveText = document.getElementById('save-text');
    const saveLoader = document.getElementById('save-loader');

    // Disable the button and show the loader
    saveButton.disabled = true;
    saveText.classList.add('hidden');
    saveLoader.classList.remove('hidden');

    const formData = collectFormData();
    sendData(formData);
});

// Optional: Enable the button when the page is fully loaded
window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('save').disabled = false;
});