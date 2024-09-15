from fastapi import Request
from fastapi.responses import JSONResponse
from core.helpers.exceptions import CustomException


def http_exception_handler(request: Request, exc: Exception | CustomException):

    if not isinstance(exc, CustomException):
        raise exc

    message = exc.message
    code = exc.code

    return JSONResponse({"message": message}, status_code=code)
