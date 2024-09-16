from fastapi import Request
from fastapi.responses import JSONResponse
from core.helpers.exceptions import CustomException


async def http_exception_handler(request: Request, exc: Exception):

    return JSONResponse({"message": "Internal Server Error"}, status_code=500)


async def http_custom_exception_handler(request: Request, exc: CustomException):

    message = exc.message
    code = exc.code

    return JSONResponse({"message": message}, status_code=code)
