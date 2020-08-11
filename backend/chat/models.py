from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()


class Profile(models.Model):
    '''Profile model with all important information about user'''
    user = models.ForeignKey(to=User, related_name='user_profile', on_delete=models.CASCADE)
    username = models.CharField(max_length=64, blank=False)
    friend_list = models.ManyToManyField(to='self', blank=True)
    profile_description = models.CharField(max_length=64, blank=True)

    def __str__(self):
        return self.username


class Chat(models.Model):
    participant_list = models.ManyToManyField(to=Profile, related_name='chat_list', blank=True)
    title = models.CharField(max_length=64)

    def __str__(self):
        return f'chat_id: {self.id}; title: {self.title}'


class Message(models.Model):
    author = models.ForeignKey(to=Profile, related_name='message_list', on_delete=models.CASCADE)
    chat = models.ForeignKey(to=Chat, related_name='message_list', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f' by: {self.author.username} ({self.author.id}); {self.chat.title} ({self.chat.id})'
