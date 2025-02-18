document.addEventListener("DOMContentLoaded", function () {
    const BASE_URL = "http://127.0.0.1:5000";
    const recipeForm = document.getElementById("recipeForm");
    const recipeList = document.getElementById("recipeList");
    const editModal = document.getElementById("editModal");
    const closeModalButton = document.querySelector(".close");
    const saveEditButton = document.getElementById("saveEdit");

    // Handle form submission
    recipeForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const formData = new FormData(recipeForm);

        try {
            const response = await fetch(`${BASE_URL}/add_recipe`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            alert(data.message);
            recipeForm.reset();
            await fetchRecipes();
        } catch (error) {
            console.error("Error:", error);
        }
    });

    // Fetch and display recipes
    async function fetchRecipes() {
        try {
            const response = await fetch(`${BASE_URL}/get_recipes`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            recipeList.innerHTML = "";

            data.forEach(recipe => {
                const recipeItem = document.createElement("div");
                recipeItem.innerHTML = createRecipeCard(recipe);
                recipeList.appendChild(recipeItem);
            });

            attachMenuListeners();
        } catch (error) {
            console.error("Error fetching recipes:", error);
        }
    }

    // Create recipe card HTML
    function createRecipeCard(recipe) {
        return `
            <div class="recipe-card">
                <div class="menu-container">
                    <button class="menu-button">⋮</button>
                    <div class="menu-options">
                        <button class="edit-button" data-recipe-id="${recipe.id}">Edit</button>
                        <button class="delete-button" data-recipe-id="${recipe.id}">Delete</button>
                    </div>
                </div>
                <h3>${recipe.title}</h3>
                <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                ${recipe.image ? `<img src="${BASE_URL}/uploads/${recipe.image}" width="150">` : ""}
            </div>
        `;
    }

    // Attach event listeners to menu buttons
    function attachMenuListeners() {
        document.querySelectorAll(".menu-button").forEach(button => {
            button.addEventListener("click", function () {
                const menu = this.nextElementSibling;
                menu.style.display = menu.style.display === "block" ? "none" : "block";
            });
        });

        document.querySelectorAll(".edit-button").forEach(button => {
            button.addEventListener("click", function () {
                const recipeId = this.dataset.recipeId;
                editRecipe(recipeId);
            });
        });

        document.querySelectorAll(".delete-button").forEach(button => {
            button.addEventListener("click", function () {
                const recipeId = this.dataset.recipeId;
                deleteRecipe(recipeId);
            });
        });
    }

    // Edit recipe
    async function editRecipe(recipeId) {
        try {
            const response = await fetch(`${BASE_URL}/get_recipe/${recipeId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const recipe = await response.json();
            document.getElementById("editTitle").value = recipe.title;
            document.getElementById("editIngredients").value = recipe.ingredients;
            document.getElementById("editInstructions").value = recipe.instructions;
            document.getElementById("editRecipeId").value = recipeId;

            // Close all open menus
            document.querySelectorAll(".menu-options").forEach(menu => {
                menu.style.display = "none";
            });

            // Show the edit modal
            editModal.style.display = "block";
        } catch (error) {
            console.error("Error fetching recipe for editing:", error);
        }
    }

    // Save edited recipe
    saveEditButton.addEventListener("click", async function () {
        const recipeId = document.getElementById("editRecipeId").value;
        const newTitle = document.getElementById("editTitle").value;
        const newIngredients = document.getElementById("editIngredients").value;
        const newInstructions = document.getElementById("editInstructions").value;

        try {
            const response = await fetch(`${BASE_URL}/update_recipe/${recipeId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: newTitle,
                    ingredients: newIngredients,
                    instructions: newInstructions,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            alert(data.message);
            closeEditModal();
            await fetchRecipes();
        } catch (error) {
            console.error("Error updating recipe:", error);
        }
    });

    // Delete recipe
    async function deleteRecipe(recipeId) {
        try {
            const response = await fetch(`${BASE_URL}/delete_recipe/${recipeId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data.message);
            await fetchRecipes();
        } catch (error) {
            console.error("Error deleting recipe:", error);
        }
    }

    // Close edit modal
    function closeEditModal() {
        editModal.style.display = "none";
    }

    // Close modal when clicking outside
    document.addEventListener("click", function (event) {
        document.querySelectorAll(".menu-options").forEach(menu => {
            if (!menu.parentElement.contains(event.target)) {
                menu.style.display = "none";
            }
        });
    });

    // Close modal when clicking the close button
    closeModalButton.addEventListener("click", closeEditModal);

    // Initial fetch of recipes
    fetchRecipes();
});