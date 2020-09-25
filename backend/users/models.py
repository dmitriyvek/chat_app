from django.contrib.auth.models import AbstractUser

import chat.models


class CustomUser(AbstractUser):
    """User model that creates chat.Profile model appropriate to new user"""

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if not self.pk:
            super().save(*args, **kwargs)
            chat.models.Profile.objects.create(
                user=self, username=self.username)
        else:
            super().save(*args, **kwargs)
