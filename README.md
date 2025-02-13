# Recipe Book

## Description

A web-based recipe book that allows users to add, edit, delete, and view recipes The application uses:

- Frontend: HTML, CSS, and JavaScript

- Backend: Flask (Python) with SQLite as the database

## Features

- Add recipes with title, ingredients, instructions, and optional images.

- View all saved recipes.

- Edit existing recipes.

- Delete recipes.

- Responsive UI.

## Installation

**1. Clone the Repository**

```bash
git clone https://github.com/your-username/recipe-book.git
```
```bash
cd recipe-book
```
**2. Install Dependencies**

Ensure you have Python installed, then install Flask and dependencies:

```bash
pip install flask flask-cors
```

**3. Set Up SQLite Database**

Run the following Python script to initialize the database:
```bash
import sqlite3

conn = sqlite3.connect('recipes.db')
cursor = conn.cursor()
cursor.execute('''
    CREATE TABLE IF NOT EXISTS recipes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        ingredients TEXT NOT NULL,
        instructions TEXT NOT NULL,
        image TEXT
    )
''')
conn.commit()
conn.close()
```

**4. Run the Flask Server**

```bash
python app.py
```

**5. Open the Frontend**

Open `index.html` in a browser.

## API Endpoints

**1. Add Recipe**

**Endpoint:** `POST /add_recipe`

- **Request Body:** `multipart/form-data`

```bash
{
  "title": "Recipe Title",
  "ingredients": "Ingredient List",
  "instructions": "Cooking Instructions",
  "image": (optional file)
}
```
**2. Get Recipes**

**Endpoint:** `GET /get_recipes`

**3. Update Recipe**

- **Endpoint:** `PUT /update_recipe/<int:recipe_id>`

- **Request Body:** `application/json`

```bash
{
  "title": "New Title",
  "ingredients": "Updated Ingredients",
  "instructions": "Updated Instructions"
}
```

**4. Delete Recipe**

- **Endpoint:** `DELETE /delete_recipe/<int:recipe_id>`

## Future Improvements

- User authentication for personalized recipe storage.

- Recipe categories and search functionality.

- Improved UI with animations and transitions.
