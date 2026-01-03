import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

pool: asyncpg.Pool | None = None


async def init_db():
    global pool
    pool = await asyncpg.create_pool(
        DATABASE_URL,
        min_size=1,
        max_size=10
    )


async def close_db():
    global pool
    if pool:
        await pool.close()


async def get_db():
    if not pool:
        raise RuntimeError("Database pool not initialized")
    return pool


# import asyncpg

# async def get_db():
#     return await asyncpg.connect(
#         user="postgres",
#         password="password",
#         database="anahita_ai",
#         host="localhost"
#     )
