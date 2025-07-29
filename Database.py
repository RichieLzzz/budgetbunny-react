import psycopg2
from psycopg2.extras import RealDictCursor

def get_conn():
    return psycopg2.connect(
        host='localhost',
        database='budgetbunny',
        user='richardlau',
        password='qwewer123'
    )

try:
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT version();")
    result = cur.fetchone()
    print("****<<<Database successfully connected!>>>*** Version info:", result)
    cur.close()
    conn.close()
except Exception as e:
    print("Database connection failed, error message:", e)