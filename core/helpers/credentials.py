from passlib.context import CryptContext


def encrypt(password: str) -> str:

    return CryptContext(schemes=["bcrypt"], deprecated="auto").hash(password)


def verify(password: str, hashed_password: str) -> bool:

    return CryptContext(schemes=["bcrypt"], deprecated="auto").verify(
        password, hashed_password
    )
