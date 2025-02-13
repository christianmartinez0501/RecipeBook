from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Allows frontend access

# Database and upload folder setup
DATABASE = "recipes.db"
UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# Ensure upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Create database table
def create_table():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS recipes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                ingredients TEXT NOT NULL,
                instructions TEXT NOT NULL,
                image TEXT
            )
        """)
        conn.commit()

create_table()

# Route to add a recipe
@app.route('/add_recipe', methods=['POST'])
def add_recipe():
    data = request.form
    image_file = request.files.get("image")

    image_filename = None
    if image_file:
        image_filename = secure_filename(image_file.filename)
        image_path = os.path.join(app.config["UPLOAD_FOLDER"], image_filename)
        image_file.save(image_path)

    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()

        # Check if recipe already exists
        cursor.execute("SELECT id FROM recipes WHERE title = ? AND ingredients = ? AND instructions = ?", 
                       (data["title"], data["ingredients"], data["instructions"]))
        existing_recipe = cursor.fetchone()

        if existing_recipe:
            return jsonify({"message": "Recipe already exists"}), 400  

        cursor.execute("INSERT INTO recipes (title, ingredients, instructions, image) VALUES (?, ?, ?, ?)",
                       (data['title'], data['ingredients'], data['instructions'], image_filename))
        conn.commit()

    return jsonify({"message": "Recipe added successfully"}), 201

# Route to fetch all recipes
@app.route('/get_recipes', methods=['GET'])
def get_recipes():
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, title, ingredients, instructions, image FROM recipes")
        recipes = cursor.fetchall()

    recipes_list = [
        {"id": row[0], "title": row[1], "ingredients": row[2], "instructions": row[3], "image": row[4]} 
        for row in recipes
    ]
    
    return jsonify(recipes_list)

# Route to serve images
@app.route('/uploads/<filename>')
def get_image(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

# Delete recipe
@app.route('/delete_recipe/<int:recipe_id>', methods=['DELETE'])
def delete_recipe(recipe_id):
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM recipes WHERE id = ?", (recipe_id,))
        conn.commit()
    return jsonify({"message": "Recipe deleted successfully"}), 200

# Update an existing recipe
@app.route('/update_recipe/<int:recipe_id>', methods=['PUT'])
def update_recipe(recipe_id):
    data = request.get_json()  # Get JSON data from the request

    title = data.get("title")
    ingredients = data.get("ingredients")
    instructions = data.get("instructions")

    if not title or not ingredients or not instructions:
        return jsonify({"message": "All fields are required!"}), 400

    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE recipes SET title=?, ingredients=?, instructions=? WHERE id=?",
            (title, ingredients, instructions, recipe_id)
        )
        conn.commit()

    return jsonify({"message": "Recipe updated successfully!"})

if __name__ == "__main__":
    app.run(debug=True)
