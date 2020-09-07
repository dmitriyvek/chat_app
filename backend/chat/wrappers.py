from functools import wraps

from .loggers import get_main_logger


def generic_error_handling_wrapper(logger):
    '''Wrapper for handling all not caught exceptions in async functions and log it in given logger'''

    def decorator(function):

        @wraps(function)
        async def wrapper(*args, **kwargs):
            try:
                await function(*args, **kwargs)
            except Exception as e:
                logger.error(e, exc_info=False)

        return wrapper

    return decorator


def wrapp_all_methods(decorator):
    '''Wrap all class methods with given decorator'''

    def cls_wrapper(cls):
        for attr in cls.__dict__:
            if callable(getattr(cls, attr)):
                setattr(cls, attr, decorator(getattr(cls, attr)))
        return cls

    return cls_wrapper
