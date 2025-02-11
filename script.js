document.addEventListener("DOMContentLoaded", function () {
    const recipeForm = document.getElementById("recipeForm");

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
                recipeList.innerHTML = ""; // Clear existing recipes

                // Create recipe cards for each recipe
                data.forEach(recipe => {
                    const recipeItem = document.createElement("div");
                    recipeItem.classList.add("recipe-card");
                    recipeItem.innerHTML = `
                        <h3>${recipe.title}</h3>
                        <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                        <p><strong>Instructions:</strong> ${recipe.instructions}</p>
                        ${recipe.image ? `<img src="http://127.0.0.1:5000/uploads/${recipe.image}" width="150">` : ""}
                        <button onclick="deleteRecipe(${recipe.id})">❌ Delete</button>
                    `;
                    recipeList.appendChild(recipeItem);
                });
            })
            .catch(error => console.error("Error fetching recipes:", error));
    }

    // Function to delete a recipe by ID
    window.deleteRecipe = function(recipeId) {
        fetch(`http://127.0.0.1:5000/delete_recipe/${recipeId}`, { method: "DELETE" })
            .then(response => response.json())
            .then(data => {
                console.log(data.message); // Log the message from the backend
                fetchRecipes(); // Refresh the recipe list after deletion
            })
            .catch(error => console.error("Error deleting recipe:", error));
    }

    fetchRecipes(); // Load recipes when the page loads
});
