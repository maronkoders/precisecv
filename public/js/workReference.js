document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('addPosition');
    const workReferenceContainer = document.getElementById('workReferenceContainer');

    addButton.addEventListener('click', function(event) {
        const workReference = document.createElement('div');
        workReference.innerHTML = `
                <div class="work-reference  border border-gray-300 p-6 mb-6 rounded-lg shadow-md relative">
                         <button class="absolute bg-red-500 right-3 top-1 text-white text-xs px-2 py-1 rounded flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                </svg>
            </button>
              <hr class="my-4" />
                    <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        <div>
                            <label class="font-semibold">Position:</label>
                            <input type="text" id="position" class="block w-full border border-gray-300 rounded-md p-2 position" placeholder="Position">
                        </div>
                        <div>
                            <label class="font-semibold">Company:</label>
                            <input type="text" id="company" class="block w-full border border-gray-300 rounded-md p-2 company" placeholder="Company">
                        </div>
                        <div>
                            <label class="font-semibold">Duration:</label>
                            <input type="text" id="duration" class="block w-full border border-gray-300 rounded-md p-2 duration" placeholder="January 2020 - Present">
                        </div>
                        <div>
                            <label class="font-semibold">Title:</label>
                            <select id="title" class="block w-full border border-gray-300 rounded-md p-2">
                                <option value="Mr.">Mr</option>
                                <option value="Mrs.">Mrs</option>
                                <option value="Miss">Miss</option>
                                <option value="Dr">Dr</option>
                                <option value="Prof">Prof</option>
                            </select>
                        </div>
                    </div>
                    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <label class="font-semibold">Contact Name:</label>
                            <input type="text" id="contact-name" class="block w-full border border-gray-300 rounded-md p-2 contact-name" placeholder="Contact Name">
                        </div>
                        <div>
                            <label class="font-semibold">Contact Surname:</label>
                            <input type="text" id="contact-surname" class="block w-full border border-gray-300 rounded-md p-2 contact-surname" placeholder="Contact Surname">
                        </div>
                        <div>
                            <label class="font-semibold">Contact Email:</label>
                            <input type="email" id="contact-email" class="block w-full border border-gray-300 rounded-md p-2 contact-email" placeholder="Contact Email">
                        </div>
                        <div>
                            <label class="font-semibold">Contact Phone:</label>
                            <input type="tel" id="contact-phone" class="block w-full border border-gray-300 rounded-md p-2 contact-phone" placeholder="Contact Phone">
                        </div>
                        <div>
                            <label class="font-semibold">Contact Position:</label>
                            <input type="text" id="contact-position" class="block w-full border border-gray-300 rounded-md p-2 contact-position" placeholder="Contact Position">
                        </div>
                    </div>
                </div>
             
        `;
        workReferenceContainer.appendChild(workReference);
        const removeButton = workReference.querySelector('.relative button');
        removeButton.addEventListener('click', function() {
            workReference.remove();
        });
    });
});
