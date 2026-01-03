## How to Run

From the backend folder:

uvicorn main:app --reload

## What You Should See
Browser:

http://127.0.0.1:8000/

{ "status": "Backend is running 🚀" }


http://127.0.0.1:8000/docs
➡ Swagger UI







## More features 

**pip install python-multipart**

# Upload 

React (file upload)
   ↓
FastAPI (extract text)
   ↓
Groq (analyze text)

**pip install pypdf python-docx**

if file.filename.endswith(".pdf"):
    # extract with pypdf
elif file.filename.endswith(".docx"):
    # extract with python-docx



# postgreSql 

Good — this tells us **exactly** what the real problem is now 👍
Your PostgreSQL server **is installed**, but the `psql` command-line tool is **not in your PATH**.
This is **very common on Windows**, especially when using Git Bash.

This is **NOT a database error**. It’s an environment/path issue.

---

## 🔴 What this error means

```
bash: psql: command not found
```

It means:

> ❌ “Your shell (Git Bash) cannot find the `psql.exe` program.”

PostgreSQL **is installed**, but Windows doesn’t know where `psql.exe` lives.

---

# ✅ FIX — Choose ONE of these (Option 1 is easiest)

---

## ✅ OPTION 1 (EASIEST): Use pgAdmin’s Query Tool (NO psql needed)

Since `psql` is missing from PATH, we’ll reset the password **inside pgAdmin**.

### Steps:

1. Open **pgAdmin**
2. Right-click **PostgreSQL 18**
3. Click **Connect Server**
4. When it fails → click **Dashboard**
5. Click **Tools → Query Tool**
6. Run this SQL:

```sql
ALTER USER postgres WITH PASSWORD 'postgres123';
```

7. Save

Then update `.env`:

```env
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/anahita_ai
```

Restart FastAPI.

✅ Done.

> This works even when `psql` is missing.

---

## ✅ OPTION 2: Use full path to psql (no PATH changes)

PostgreSQL installs `psql.exe` here:

```
C:\Program Files\PostgreSQL\18\bin\psql.exe
```

Run it like this (copy-paste):

```bash
"/c/Program Files/PostgreSQL/18/bin/psql.exe" -U postgres -h localhost -p 5432
```

If that opens `postgres=#`, then reset password:

```sql
ALTER USER postgres WITH PASSWORD 'postgres123';
```

---

## ✅ OPTION 3 (PERMANENT FIX): Add PostgreSQL to PATH (Recommended)

### Step-by-step:

1. Press **Win + R**
2. Type `sysdm.cpl` → Enter
3. Go to **Advanced** → **Environment Variables**
4. Under **System variables**, find `Path`
5. Click **Edit**
6. Click **New**
7. Paste:

```
C:\Program Files\PostgreSQL\18\bin
```

8. Click **OK** → **OK**
9. Close ALL terminals
10. Open Git Bash again
11. Test:

```bash
psql --version
```

You should see something like:

```
psql (PostgreSQL) 18.x
```

Now `psql` works everywhere.

---

## 🧠 Why Git Bash showed this error

* Git Bash does **not automatically inherit Windows PATH**
* PostgreSQL installer does **not always add itself to PATH**
* So `psql` exists, but Bash can’t find it

This is **normal**, not a mistake by you.

---

## ✅ What I recommend you do NOW (fastest)

👉 **Use OPTION 1 (pgAdmin Query Tool)** to reset the password
Then test FastAPI again.

---

## 🧪 After fixing, verify FastAPI

Run:

```bash
uvicorn main:app --reload
```

If you see:

```
Application startup complete.
```

🎉 You are fully unblocked.

---

If you want, next I can:

* Verify asyncpg pool is working
* Create tables safely
* Add migrations
* Create a proper app DB user

Just tell me 👍


