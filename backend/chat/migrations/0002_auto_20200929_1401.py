# Generated by Django 3.1 on 2020-09-29 14:01

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='chat',
            name='created_by',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.DO_NOTHING, related_name='created_chat_list', to='chat.profile', verbose_name='profile of user that created this chat'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='message',
            name='is_service',
            field=models.BooleanField(default=False, verbose_name='if message contains technical info'),
        ),
        migrations.AlterField(
            model_name='chat',
            name='last_message',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='last_message_in_chat', to='chat.message', verbose_name='the last message written in this chat'),
        ),
    ]
