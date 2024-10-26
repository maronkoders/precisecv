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
                <div class="relative mt-4">
                <button class="absolute right-0 top-0 mt-1 mr-1 bg-red-500 text-white text-xs px-2 py-1 rounded">Remove</button>
            </div>
        <div class="grid grid-cols-3 gap-4">
                <div>
                    <p class="font-semibold  mt-2">Position:</p>
                    <input type="text" class="block w-full appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded shadow position" placeholder="Position">
                </div>
                <div>
                    <p class="font-semibold mt-2">Company:</p>
                    <input type="text" class="block w-full appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded shadow company " placeholder="Company">
                </div>
                <div>
                    <p class="font-semibold mt-2">Duration:</p>
                    <input type="text" class="block w-full appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded shadow duration" placeholder="January 2020 - present">
                </div>
            </div>

            <p class="font-semibold mt-2">Responsibility:</p>
            <textarea class="block w-full appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded shadow responsibility mt-2" rows="4" cols="50" placeholder="Responsibility"></textarea>
          
            </div>
           
        `;
        workExperienceContainer.appendChild(workExperience);

        const removeButton = workExperience.querySelector('.relative button');
        removeButton.addEventListener('click', function() {
            workExperience.remove();
        });
    });
});
