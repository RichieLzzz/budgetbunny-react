from flask import Flask, request, jsonify
from Database import get_conn
from psycopg2.extras import RealDictCursor

app = Flask(__name__)

# ---------------------<<<<< Registration and Login >>>>>---------------------
# Registration endpoint
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    with get_conn() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('SELECT id FROM users WHERE email=%s', (email,))
            if cur.fetchone():
                return jsonify({"error": "Email already exists"}), 400
            cur.execute(
                'INSERT INTO users (email, username, password) VALUES (%s, %s, %s) RETURNING id',
                (email, username, password)
            )
            conn.commit()
            return jsonify({"message": f"Welcome to the bunny hole, {username}!"}), 201


# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    with get_conn() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('SELECT username, password FROM users WHERE email=%s', (email,))
            user = cur.fetchone()
            if user and user['password'] == password:
                return jsonify({"message": f"Welcome back, {user['username']}!"})
            else:
                return jsonify({"error": "Invalid email or password"}), 401

# ---------------------<<<<< Expense Management >>>>>---------------------
# Add an expense endpoint
@app.route('/add_expense', methods=['POST'])
def add_expense():
    data = request.get_json()
    email = data.get('email')
    amount = data.get('amount')
    description = data.get('description')
    category = data.get('category', 'Uncategorized')
    with get_conn() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('SELECT id FROM users WHERE email=%s', (email,))
            user = cur.fetchone()
            if not user:
                return jsonify({"error": "User not found"}), 404
            cur.execute(
                'INSERT INTO expenses (user_id, amount, description, category) VALUES (%s, %s, %s, %s) RETURNING id',
                (user['id'], amount, description, category)
            )
            expense_id = cur.fetchone()['id']
            # Query total spent by the user
            cur.execute('SELECT SUM(amount) FROM expenses WHERE user_id=%s', (user['id'],))
            total_spent = cur.fetchone()['sum'] or 0
            conn.commit()
            return jsonify({
                "message": "Carrot record added successfully",
                "expense": {
                    "id": expense_id,
                    "amount": float(amount),
                    "description": description,
                    "category": category
                },
                "total_spent": float(total_spent)
            })

# ---------------------<<<<< Monthly Goal and Summary >>>>>---------------------
# Set monthly goal endpoint
@app.route('/set_goal', methods=['POST'])
def set_goal():
    data = request.get_json()
    email = data.get('email')
    goal = data.get('goal')
    with get_conn() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('SELECT id FROM users WHERE email=%s', (email,))
            user = cur.fetchone()
            if not user:
                return jsonify({"error": "User not found"}), 404
            cur.execute('UPDATE users SET goal=%s WHERE id=%s', (goal, user['id']))
            conn.commit()
            return jsonify({"message": f"I won't eat more than {goal} carrots this month!"})

# Get summary endpoint
@app.route('/summary', methods=['GET'])
def summary():
    email = request.args.get('email')
    with get_conn() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('SELECT id, goal FROM users WHERE email=%s', (email,))
            user = cur.fetchone()
            if not user:
                return jsonify({"error": "User not found"}), 404
            cur.execute('SELECT SUM(amount) FROM expenses WHERE user_id=%s', (user['id'],))
            total_spent = cur.fetchone()['sum'] or 0
            goal = user['goal']
            remaining = goal - total_spent
            return jsonify({
                "total_spent": float(total_spent),
                "goal": float(goal),
                "remaining_budget": float(remaining)
            })

# ---------------------<<<<< Expense Management Operations >>>>>---------------------
# Edit an existing expense
@app.route('/edit_expense', methods=['PUT'])
def edit_expense():
    data = request.get_json()
    email = data.get('email')
    expense_id = data.get('id')
    new_amount = data.get('amount')
    new_description = data.get('description')
    with get_conn() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Find user
            cur.execute('SELECT id FROM users WHERE email=%s', (email,))
            user = cur.fetchone()
            if not user:
                return jsonify({"error": "User not found"}), 404
            # Query existing expense
            cur.execute('SELECT * FROM expenses WHERE id=%s AND user_id=%s', (expense_id, user['id']))
            expense = cur.fetchone()
            if not expense:
                return jsonify({"error": "Expense not found"}), 404
            # Update expense
            if new_amount is not None:
                cur.execute('UPDATE expenses SET amount=%s WHERE id=%s', (new_amount, expense_id))
            if new_description:
                cur.execute('UPDATE expenses SET description=%s WHERE id=%s', (new_description, expense_id))
            conn.commit()
            # Query updated expense
            cur.execute('SELECT * FROM expenses WHERE id=%s', (expense_id,))
            updated_expense = cur.fetchone()
            return jsonify({"message": "Carrot record updated", "expense": updated_expense})


# Delete an expense
@app.route('/delete_expense', methods=['DELETE'])
def delete_expense():
    data = request.get_json()
    email = data.get('email')
    expense_id = data.get('id')
    with get_conn() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            # Find user
            cur.execute('SELECT id FROM users WHERE email=%s', (email,))
            user = cur.fetchone()
            if not user:
                return jsonify({"error": "User not found"}), 404
            # Confirm expense exists
            cur.execute('SELECT * FROM expenses WHERE id=%s AND user_id=%s', (expense_id, user['id']))
            expense = cur.fetchone()
            if not expense:
                return jsonify({"error": "Expense not found"}), 404
            cur.execute('DELETE FROM expenses WHERE id=%s', (expense_id,))
            conn.commit()
            return jsonify({"message": f"Carrot record {expense_id} deleted successfully!"})

# ---------------------<<<<< Expense Retrieval and Summary >>>>>---------------------
# Get all expenses for a user
@app.route('/expenses', methods=['GET'])
def get_expenses():
    email = request.args.get('email')
    with get_conn() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('SELECT id FROM users WHERE email=%s', (email,))
            user = cur.fetchone()
            if not user:
                return jsonify({"error": "User not found"}), 404
            cur.execute('SELECT * FROM expenses WHERE user_id=%s ORDER BY id DESC', (user['id'],))
            expenses = cur.fetchall()
            return jsonify({"Carrot Record": expenses})

# Get category summary endpoint
@app.route('/category_summary', methods=['GET'])
def category_summary():
    email = request.args.get('email')
    with get_conn() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute('SELECT id FROM users WHERE email=%s', (email,))
            user = cur.fetchone()
            if not user:
                return jsonify({"error": "User not found"}), 404
            cur.execute("""
                SELECT category, SUM(amount) as total
                FROM expenses
                WHERE user_id=%s
                GROUP BY category
                ORDER BY total DESC
            """, (user['id'],))
            summary = cur.fetchall()
            return jsonify({"My carrot record book": summary})

if __name__ == '__main__':
    app.run(debug=True)
