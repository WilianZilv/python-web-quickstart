import os
from typing import cast
import dotenv


FILE = ".env"

DEV_ENV_PATH = ".env.dev"

if os.path.exists(DEV_ENV_PATH):
    FILE = DEV_ENV_PATH


env = dotenv.dotenv_values(FILE)

DATABASE_URI = cast(str, env.get("DATABASE_URI"))

assert DATABASE_URI, "DATABASE_URI is not set"
