document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('addExperience');
    const workExperienceContainer = document.getElementById('workExperienceContainer');

    addButton.addEventListener('click', function(event) {
        const workExperience = document.createElement('div');
        workExperience.innerHTML = `

                 <div class="work-experience border border-gray-300 p-6 mb-1 rounded-lg shadow-md relative">
                    <button class="absolute bg-red-500 right-3 top-1 text-white text-xs px-2 py-1 rounded flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                        </svg>
                        REMOVE
                    </button>
                      <hr class="my-4" />
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
        removeButton.addEventListener('click', function(event) {
           workExperience.remove();
        });
    });
});
