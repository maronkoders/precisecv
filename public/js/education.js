document.addEventListener('click', function(event) {
    // Add Grade Functionality
    if (event.target && event.target.classList.contains('addGrade')) {
        const gradeContainer = event.target.previousElementSibling;
        const newGrade = document.createElement('div');
        newGrade.classList.add('grade-entry', 'flex', 'gap-4', 'mt-2');

        newGrade.innerHTML = `
            <input type="text" class="block w-1/2 bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 grade-subject" placeholder="Subject">
            <input type="text" class="block w-1/2 bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 grade-score" placeholder="Score">
            <button class="removeGrade bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md">Remove</button>
        `;
        gradeContainer.appendChild(newGrade);
    }

    // Remove Grade Functionality
    if (event.target && event.target.classList.contains('removeGrade')) {
        const gradeEntry = event.target.parentElement;
        gradeEntry.remove();
    }

    // Remove Education Functionality
    if (event.target && event.target.classList.contains('removeEducation')) {
        const educationSection = event.target.closest('.education');
        educationSection.remove();
    }
});

/**
 * Adds a new education section.
 */
document.getElementById('addEducation').addEventListener('click', function() {
    const educationContainer = document.getElementById('educationContainer');
    const newEducation = document.createElement('div');
    newEducation.classList.add('education', 'border', 'border-gray-300', 'p-6', 'mb-6', 'rounded-lg', 'shadow-md', 'relative');

    newEducation.innerHTML = `
        <button class="removeEducation absolute top-4 right-4 bg-red-500 text-white text-sm px-3 py-1 rounded hover:bg-red-600">Remove</button>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
                <p class="font-semibold">School Name:</p>
                <input type="text" class="block w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 school" placeholder="School Name">
            </div>
            <div>
                <p class="font-semibold">Level:</p>
                <input type="text" class="block w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 level" placeholder="Level">
            </div>
            <div>
                <p class="font-semibold">Duration:</p>
                <input type="text" class="block w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 duration" placeholder="January 2020 - Present">
            </div>
        </div>
        <div class="mt-6">
            <p class="font-semibold mb-2"><u>Grades:</u></p>
            <small class="mb-3 block"><em>Click the "Add Grade" button to add</em></small>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 grade-score-container">
                <!-- Grade Entries Will Be Added Here -->
            </div>
            <button class="addGrade mt-4 bg-blue-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">Add Grade</button>
        </div>
    `;
    educationContainer.appendChild(newEducation);
});