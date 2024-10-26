document.addEventListener('DOMContentLoaded', function() {
    const addEducationButton = document.getElementById('addEducation');
    const educationContainer = document.getElementById('educationContainer');

    addEducationButton.addEventListener('click', function() {
        const education = document.createElement('div');
        education.classList.add('education', 'border', 'border-gray-300', 'p-4', 'mt-2');
        education.innerHTML = `
            <div class="relative mt-4">
                <button class="absolute right-0 top-0 mt-1 mr-1 bg-red-500 text-white text-xs px-2 py-1 rounded">Remove</button>
            </div>
            <div class="grid grid-cols-4 gap-4">
                <div>
                    <p class="font-semibold mt-2">School Name:</p>
                    <input type="text" class="block w-full appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded shadow school" placeholder="School Name">
                </div>
                <div>
                    <p class="font-semibold mt-2">Level:</p>
                    <input type="text" class="block w-full appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded shadow level" placeholder="Level">
                </div>
                <div>
                    <p class="font-semibold mt-2">Duration:</p>
                    <input type="text" class="block w-full appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded shadow duration" placeholder="January 2020 - present">
                </div>
            </div>
            <div class="grid gap-4 mt-4">
                <div>
                    <p class="font-semibold mt-2"><u>Grades:</u></p>
                    <small class="mb-3"><em>Click the add Grade button to add</em></small>
                    <div class="grid grid-cols-1 gap-4 mt-4 grade-score-container">
                        <!-- Grades will be added here -->
                    </div>
                    <button class="addGrade mt-4 bg-blue-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">Add Grade</button>
                </div>
            </div>
        `;
        educationContainer.appendChild(education);

        const removeButton = education.querySelector('.relative button');
        removeButton.addEventListener('click', function() {
            education.remove();
        });

        const addGradeButton = education.querySelector('.addGrade');
        const gradeScoreContainer = education.querySelector('.grade-score-container');

        addGradeButton.addEventListener('click', function() {
            const gradeScore = document.createElement('div');
            gradeScore.classList.add('grid', 'grid-cols-3', 'gap-4', 'mt-2');
            gradeScore.innerHTML = `
                <div>
                    <input type="text" class="mt-1 mb-1 block w-full appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded shadow subject" placeholder="Subject">
                </div>
                <div>
                    <input type="text" class="mt-1 mb-1 block w-full appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded shadow score" placeholder="Score">
                </div>
                <div class="relative">
                    <button class="absolute right-0 top-0 mt-1 mr-1 bg-red-500 text-white text-xs px-2 py-1 rounded">Remove</button>
                </div>
            `;
            gradeScoreContainer.appendChild(gradeScore);

            const removeGradeButton = gradeScore.querySelector('.relative button');
            removeGradeButton.addEventListener('click', function() {
                gradeScore.remove();
            });
        });
    });
});
