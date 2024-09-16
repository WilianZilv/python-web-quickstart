import os
from typing import cast
import dotenv


def get_env(key: str, do_raise: bool = False) -> str | None:

    value = dotenv.dotenv_values(".env.dev").get(
        key, dotenv.dotenv_values(".env").get(key, os.getenv(key))
    )

    if do_raise and value is None:
        raise ValueError(f"enviroment variable {key} is not set")

    return value


DATABASE_URI = cast(str, get_env("DATABASE_URI"))


assert DATABASE_URI, "DATABASE_URI is not set"
