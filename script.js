document.addEventListener('DOMContentLoaded', () => {
    // Kode ini akan berjalan di SEMUA halaman
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker terdaftar', reg))
            .catch(err => console.error('Gagal mendaftar Service Worker', err));
    }

    // --- KODE KHUSUS HALAMAN RENCANA MENU ---
    const mealPlannerEl = document.getElementById('meal-planner');
    if (mealPlannerEl) {
        const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
        const meals = ['Sarapan', 'Makan Siang', 'Makan Malam'];

        function createMealPlannerUI() {
            days.forEach(day => {
                const dayCard = document.createElement('div');
                dayCard.className = 'day-card';
                dayCard.innerHTML = `<h3>${day}</h3>`;
                meals.forEach(meal => {
                    const mealId = `${day.toLowerCase()}-${meal.toLowerCase().replace(' ', '')}`;
                    dayCard.innerHTML += `
                        <label for="${mealId}">${meal}</label>
                        <input type="text" id="${mealId}" placeholder="...">
                    `;
                });
                mealPlannerEl.appendChild(dayCard);
            });
        }

        function saveMealPlan() {
            mealPlannerEl.querySelectorAll('input').forEach(input => {
                if (input.value) localStorage.setItem(input.id, input.value);
                else localStorage.removeItem(input.id);
            });
        }

        function loadMealPlan() {
            mealPlannerEl.querySelectorAll('input').forEach(input => {
                input.value = localStorage.getItem(input.id) || '';
            });
        }

        createMealPlannerUI();
        loadMealPlan();
        mealPlannerEl.addEventListener('input', saveMealPlan);
    }

    // --- KODE KHUSUS HALAMAN DAFTAR BELANJA ---
    const shoppingFormEl = document.getElementById('shopping-form');
    if (shoppingFormEl) {
        const itemInput = document.getElementById('item-input');
        const listContainer = document.getElementById('list-container');
        let shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];

        function saveShoppingList() {
            localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
        }

        function renderShoppingList() {
            listContainer.innerHTML = '';
            shoppingList.forEach((item, index) => {
                const li = document.createElement('li');
                li.textContent = item.text;
                if (item.done) li.classList.add('done');
                li.addEventListener('click', () => toggleDone(index));

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'Hapus';
                deleteBtn.addEventListener('click', e => {
                    e.stopPropagation();
                    deleteItem(index);
                });

                li.appendChild(deleteBtn);
                listContainer.appendChild(li);
            });
        }

        function addItem(text) {
            shoppingList.push({ text, done: false });
            saveShoppingList();
            renderShoppingList();
        }

        function toggleDone(index) {
            shoppingList[index].done = !shoppingList[index].done;
            saveShoppingList();
            renderShoppingList();
        }

        function deleteItem(index) {
            shoppingList.splice(index, 1);
            saveShoppingList();
            renderShoppingList();
        }

        shoppingFormEl.addEventListener('submit', e => {
            e.preventDefault();
            const text = itemInput.value.trim();
            if (text) {
                addItem(text);
                itemInput.value = '';
                itemInput.focus();
            }
        });

        renderShoppingList();
    }
});