from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()


class Profile(models.Model):
    '''A model of the user`s profile with all custom (user-defined) information about the user'''
    user = models.ForeignKey(to=User, verbose_name='django user model related to this profile',
                             related_name='user_profile', on_delete=models.CASCADE)
    username = models.CharField(verbose_name='username from django user model (no need in sql query for getting related django`s user model)',
                                max_length=64, blank=False)
    avatar_url = models.URLField(
        max_length=200, blank=True, verbose_name='url of the profile`s avatar')
    friend_list = models.ManyToManyField(verbose_name='list of friend`s profiles',
                                         to='self', blank=True)
    profile_description = models.CharField(verbose_name='text description (status) of profile written by user',
                                           max_length=64, blank=True)

    def __str__(self):
        return self.username


class Chat(models.Model):
    '''A model by which all messages and participants in a given chat (conversation) are available'''
    participant_list = models.ManyToManyField(to='Profile', verbose_name='list of chat participant`s profiles',
                                              related_name='chat_list', blank=True)
    last_message = models.ForeignKey(to='Message', verbose_name='the last message written in this chat',
                                     blank=True, null=True, related_name='last_message_in_chat', on_delete=models.SET_NULL)

    class Meta:
        ordering = ['-last_message__timestamp']

    def __str__(self):
        return f'chat_id: {self.id}'


class Message(models.Model):
    '''A model representing message sent by a user in a specific chat'''
    author = models.ForeignKey(to='Profile', verbose_name='profile model of the message`s author',
                               related_name='message_list', on_delete=models.CASCADE)
    chat = models.ForeignKey(to='Chat', verbose_name='chat`s model in which message was created',
                             related_name='message_list', on_delete=models.CASCADE)
    content = models.TextField(verbose_name='text of message')
    timestamp = models.DateTimeField(
        auto_now_add=True, verbose_name='message creation timestamp')

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f' by:{self.author.id};chat:{self.chat.id};{self.content[:10]}'
