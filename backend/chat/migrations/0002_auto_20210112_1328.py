# Generated by Django 3.1 on 2021-01-12 10:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='avatar_url',
            field=models.URLField(blank=True, default='https://www.clarity-enhanced.net/wp-content/uploads/2020/06/rick.jpg', verbose_name='url of the profile`s avatar'),
        ),
    ]
