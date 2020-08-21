# Generated by Django 3.1 on 2020-08-21 13:35

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0003_profile_username'),
    ]

    operations = [
        migrations.AddField(
            model_name='chat',
            name='last_message',
            field=models.ForeignKey(blank=True, default=8, on_delete=django.db.models.deletion.CASCADE, related_name='last_message_in_chat', to='chat.message'),
            preserve_default=False,
        ),
    ]
