document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('addExperience');
    const workExperienceContainer = document.getElementById('workExperienceContainer');

    addButton.addEventListener('click', function() {
        const workExperience = document.createElement('div');
        workExperience.classList.add('work-experience');
        workExperience.classList.add('border');
        workExperience.classList.add('border-gray-300');
        workExperience.classList.add('p-4');
        workExperience.classList.add('mt-2');
        workExperience.innerHTML = `
        <div class="relative">
                <button class="absolute right-0 top-0 mt-1 mr-1 bg-red-500 text-white text-xs px-2 py-1 rounded">Remove</button>
            </div>

                 <div class="work-experience border border-gray-300 p-6 mb-6 rounded-lg shadow-md relative">
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                            <label class="font-semibold">Position:</label>
                            <input type="text" class="block w-full border border-gray-300 rounded-md p-2 position" placeholder="Position">
                        </div>
                        <div>
                            <label class="font-semibold">Company:</label>
                            <input type="text" class="block w-full border border-gray-300 rounded-md p-2 company" placeholder="Company">
                        </div>
                        <div>
                            <label class="font-semibold">Duration:</label>
                            <input type="text" class="block w-full border border-gray-300 rounded-md p-2 duration" placeholder="January 2020 - Present">
                        </div>
                    </div>
                    <div class="mt-6">
                        <label class="font-semibold">Responsibility:</label>
                        <textarea class="block w-full border border-gray-300 rounded-md p-2 responsibility" rows="4" placeholder="Responsibility"></textarea>
                    </div>
                </div>
        `;
        workExperienceContainer.appendChild(workExperience);

        const removeButton = workExperience.querySelector('.relative button');
        removeButton.addEventListener('click', function() {
            workExperience.remove();
        });
    });
});
