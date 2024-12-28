import os

# ... other settings ...

SECRET_KEY = os.environ.get('AUTH_SECRET_KEY')


# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': os.environ.get('AUTH_DB_NAME'),
#         'USER': os.environ.get('AUTH_DB_USER'),
#         'PASSWORD': os.environ.get('AUTH_DB_PASSWORD'),
#         'HOST': os.environ.get('AUTH_DB_HOST'),
#         'PORT': os.environ.get('AUTH_DB_PORT'),
#     }
# }

# ... rest of your settings ...
