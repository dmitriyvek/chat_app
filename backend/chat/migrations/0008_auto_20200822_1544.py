# Generated by Django 3.1 on 2020-08-22 15:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0007_auto_20200822_0822'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='message',
            options={'ordering': ['-timestamp']},
        ),
    ]
