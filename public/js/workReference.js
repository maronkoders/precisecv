document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.getElementById('addPosition');
    const workReferenceContainer = document.getElementById('workReferenceContainer');

    addButton.addEventListener('click', function() {
        const workReference = document.createElement('div');
        workReference.classList.add('work-reference');
        workReference.classList.add('border');
        workReference.classList.add('border-gray-300');
        workReference.classList.add('p-4');
        workReference.classList.add('mt-2');
        workReference.innerHTML = `
        <div class="relative mb-2"><button class="absolute right-0 top-0 mt-1 mr-1 bg-red-500 text-white text-xs px-2 py-1 rounded">Remove</button>
                                </div>

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

             
                
                 
      
         
        `;
        workReferenceContainer.appendChild(workReference);

        const removeButton = workReference.querySelector('.relative button');
        removeButton.addEventListener('click', function() {
            workReference.remove();
        });
    });
});
