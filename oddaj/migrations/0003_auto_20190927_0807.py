# Generated by Django 2.2.5 on 2019-09-27 08:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('oddaj', '0002_auto_20190918_0857'),
    ]

    operations = [
        migrations.AddField(
            model_name='donation',
            name='is_taken',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='institution',
            name='categories',
            field=models.ManyToManyField(to='oddaj.Category'),
        ),
        migrations.AlterUniqueTogether(
            name='institution',
            unique_together={('name',)},
        ),
    ]
