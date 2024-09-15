import jwt

JWT_SECRET = "secret"
JWT_ALGORITHM = "HS256"


class JWT:

    @staticmethod
    def encode(payload: dict) -> str:
        return jwt.encode(payload, key=JWT_SECRET, algorithm=JWT_ALGORITHM)

    @staticmethod
    def decode(token: str) -> dict:
        return jwt.decode(token, key=JWT_SECRET, algorithms=[JWT_ALGORITHM])
