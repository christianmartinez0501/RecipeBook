import sqlite3
conn = sqlite3.connect("recipes.db")
cursor = conn.cursor()
cursor.execute("SELECT * FROM recipes")
print(cursor.fetchall())
conn.close()
