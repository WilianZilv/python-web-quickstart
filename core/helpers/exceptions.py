class CustomException(Exception):
    message: str
    code: int


class UserNotFound(CustomException):
    message = "User Not Found"
    code = 404


class NotFoundError(CustomException):
    message = "Not Found"
    code = 404


class InvalidPassword(CustomException):
    message = "Invalid Password"
    code = 401


class PasswordsDontMatch(CustomException):
    message = "Passwords Dont Match"
    code = 401


class NotAuthorized(CustomException):
    message = "Not Authorized"
    code = 401


class EmailAlreadyExists(CustomException):
    message = "Email Already Exists"
    code = 409


class UsernameAlreadyExists(CustomException):
    message = "Username Already Exists"
    code = 409


class EmailNotFound(CustomException):
    message = "Email Not Found"
    code = 404


class UsernameNotFound(CustomException):
    message = "Username Not Found"
    code = 404
