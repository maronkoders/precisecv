 //Skills JS
 document.addEventListener('DOMContentLoaded', function() {
    const addSkillButton = document.getElementById('addSkill');
    const skillsContainer = document.getElementById('skillsContainer');

    addSkillButton.addEventListener('click', function() {
        const skillInput = document.createElement('div');

        skillInput.innerHTML = `
        <div class="relative mb-2">
            <button class="absolute right-0 top-0 mt-1 mr-1 bg-red-500 text-white text-xs px-2 py-1 rounded">Remove</button>
                </div>
            <div class="grid gap-4  grid-cols-2 mt-2">
                <div>
                    <input type="text" id="skill" class="block w-full appearance-none bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 rounded shadow skill" placeholder="Skill">
                    </div>
          
        </div>
        `;

     skillsContainer.appendChild(skillInput);
     const removeButton = skillInput.querySelector('.relative button');
        removeButton.addEventListener('click', function() {
            skillInput.remove();
        });
    });
});
