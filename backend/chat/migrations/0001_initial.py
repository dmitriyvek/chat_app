# Generated by Django 3.1 on 2021-01-09 11:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
            options={
                'ordering': ['-last_message__timestamp'],
            },
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=64, verbose_name='username from django user model (no need in sql query for getting related django`s user model)')),
                ('avatar_url', models.URLField(blank=True, default='https://www.clarity-enhanced.net/wp-content/uploads/2020/06/filip.jpg', verbose_name='url of the profile`s avatar')),
                ('profile_description', models.CharField(blank=True, max_length=64, verbose_name='text description (status) of profile written by user')),
                ('friend_list', models.ManyToManyField(blank=True, related_name='_profile_friend_list_+', to='chat.Profile', verbose_name='list of friend`s profiles')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_profile', to=settings.AUTH_USER_MODEL, verbose_name='django user model related to this profile')),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField(verbose_name='text of message')),
                ('timestamp', models.DateTimeField(auto_now_add=True, verbose_name='message creation timestamp')),
                ('is_service', models.BooleanField(default=False, verbose_name='if message contains technical info')),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='message_list', to='chat.profile', verbose_name='profile model of the message`s author')),
                ('chat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='message_list', to='chat.chat', verbose_name='chat`s model in which message was created')),
            ],
            options={
                'ordering': ['-timestamp'],
            },
        ),
        migrations.AddField(
            model_name='chat',
            name='created_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='created_chat_list', to='chat.profile', verbose_name='profile of user that created this chat'),
        ),
        migrations.AddField(
            model_name='chat',
            name='last_message',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='last_message_in_chat', to='chat.message', verbose_name='the last message written in this chat'),
        ),
        migrations.AddField(
            model_name='chat',
            name='participant_list',
            field=models.ManyToManyField(blank=True, related_name='chat_list', to='chat.Profile', verbose_name='list of chat participant`s profiles'),
        ),
    ]
