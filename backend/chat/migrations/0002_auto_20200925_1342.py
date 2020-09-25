# Generated by Django 3.1 on 2020-09-25 13:42

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_profile', to=settings.AUTH_USER_MODEL, verbose_name='django user model related to this profile'),
        ),
        migrations.AddField(
            model_name='message',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='message_list', to='chat.profile', verbose_name='profile model of the message`s author'),
        ),
        migrations.AddField(
            model_name='message',
            name='chat',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='message_list', to='chat.chat', verbose_name='chat`s model in which message was created'),
        ),
        migrations.AddField(
            model_name='chat',
            name='last_message',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='last_message_in_chat', to='chat.message', verbose_name='the last message written in this chat'),
        ),
        migrations.AddField(
            model_name='chat',
            name='participant_list',
            field=models.ManyToManyField(blank=True, related_name='chat_list', to='chat.Profile', verbose_name='list of chat participant`s profiles'),
        ),
    ]
