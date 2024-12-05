document.addEventListener('click', function(event) {
    // Add Grade Functionality
    if (event.target && event.target.classList.contains('addGrade')) {
        const gradeContainer = event.target.previousElementSibling;
        const newGrade = document.createElement('div');
        newGrade.classList.add('grade-entry', 'w-full', 'flex', 'gap-4', 'mt-2');

        newGrade.innerHTML = `

            <input type="text" class="block w-1/2 bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 grade-subject" placeholder="Subject">
            <input type="text" class="block w-1/2 bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 grade-score" placeholder="Score">
            <button class="removeGrade  absolute bg-red-500 left-0 top-1 text-white text-xs px-2 py-1 rounded flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
                REMOVE
            </button>
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
                <button class="removeEducation absolute bg-red-500 right-3 top-1 text-white text-xs px-2 py-1 rounded flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
                REMOVE
            </button>
        
        <hr class="my-4" />
      
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
            <small class="mb-3 block"><em>Click the "+" button to add a grade</em></small>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 grade-score-container">
                
            </div>
            <button class="addGrade mt-4 bg-blue-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
            </button>
        </div>
    `;
    educationContainer.appendChild(newEducation);
});