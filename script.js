document.addEventListener("DOMContentLoaded", function () {
    const recipeForm = document.getElementById("recipeForm");
    let currentRecipeId = null;

    // Handle the form submission
    recipeForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Get form data, including the image file
        const formData = new FormData(recipeForm);

        // Send data to the Flask backend
        fetch("http://127.0.0.1:5000/add_recipe", {
            method: "POST",
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message); // Show success message
            recipeForm.reset(); // Clear the form
            fetchRecipes(); // Refresh the recipe list
        })
        .catch(error => console.error("Error:", error));
    });

    // Fetch and display saved recipes
    function fetchRecipes() {
        fetch("http://127.0.0.1:5000/get_recipes")
            .then(response => response.json())
            .then(data => {
                const recipeList = document.getElementById("recipeList");
                recipeList.innerHTML = ""; 
        
                data.forEach(recipe => {
                    const recipeItem = document.createElement("div");
                    recipeItem.classList.add("recipe-card");
                    recipeItem.innerHTML = `
                        <div class="menu-container">
                            <button class="menu-button">⋮</button>
                            <div class="menu-options">
                                <button onclick="editRecipe(${recipe.id})">Edit</button>
                                <button onclick="deleteRecipe(${recipe.id})">Delete</button>
                            </div>
                        </div>
                        <h3>${recipe.title}</h3>
                        <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                        <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                        ${recipe.image ? `<img src="http://127.0.0.1:5000/uploads/${recipe.image}" width="150">` : ""}
                    `;
    
                    recipeList.appendChild(recipeItem);
                });
    
                // Add event listeners for toggling menu
                document.querySelectorAll(".menu-button").forEach(button => {
                    button.addEventListener("click", function () {
                        const menu = this.nextElementSibling;
                        menu.style.display = menu.style.display === "block" ? "none" : "block";
                    });
                });
    
                // Close menu if clicked outside
                document.addEventListener("click", function (event) {
                    document.querySelectorAll(".menu-options").forEach(menu => {
                        if (!menu.parentElement.contains(event.target)) {
                            menu.style.display = "none";
                        }
                    });
                });
            })
            .catch(error => console.error("Error fetching recipes:", error));
    }

        // Function to edit a recipe by ID
        window.editRecipe = function editRecipe(recipeId, title, ingredients, instructions, menuID) {
            // console.log("Opening edit modal for Recipe ID:", recipeId); 
            const modal = document.getElementById("editModal");
            
            //hide the three dot menu
            const menu = document.getElementById(menuID)
            if(menu) menu.style.display = "none";

            document.getElementById("editTitle").style.value = title;
            document.getElementById("editIngredients").style.value = ingredients;
            document.getElementById("editInstructions").style.value = instructions;
            currentRecipeId = recipeId;

            modal.style.display = "block"; // Make modal visible
        };
            
        // Open edit modal with recipe data
        document.querySelector(".close").click = function () {
            document.getElementById("editModal").style.display = "none"
        };
    
        // Save edited recipe
        document.getElementById("saveEdit").onclick = function () {
            const newTitle = document.getElementById("editTitle").value;
            const newIngredients = document.getElementById("editIngredients").value;
            const newInstructions = document.getElementById("editInstructions").value;
    
            fetch(`http://127.0.0.1:5000/edit_recipe/${currentRecipeId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    title: newTitle,
                    ingredients: newIngredients,
                    instructions: newInstructions,
                }),
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                document.getElementById("editModal").style.display = "none";
                fetchRecipes();
            })
            .catch(error => console.error("Error editing recipe figure it out! :)", error));
        };
    
    // Function to delete a recipe by ID
    window.deleteRecipe = function(recipeId) {
        fetch(`http://127.0.0.1:5000/delete_recipe/${recipeId}`, { method: "DELETE" })
            .then(response => response.json())
            .then(data => {
                console.log(data.message); // Log the message from the backend
                fetchRecipes(); // Refresh the recipe list after deletion
            })
            .catch(error => console.error("Error deleting recipe:", error));
    };
    fetchRecipes(); 
});
