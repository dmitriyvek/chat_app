# Generated by Django 3.1 on 2020-08-11 14:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0002_auto_20200811_1109'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='username',
            field=models.CharField(default='admin', max_length=64),
            preserve_default=False,
        ),
    ]
