# Generated by Django 3.1 on 2020-08-22 08:22

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0006_auto_20200822_0812'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chat',
            name='last_message',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='last_message_in_chat', to='chat.message'),
        ),
    ]
