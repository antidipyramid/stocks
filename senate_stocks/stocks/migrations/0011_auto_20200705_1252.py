# Generated by Django 3.0.7 on 2020-07-05 12:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stocks', '0010_remove_trade_senator'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trade',
            name='asset_name',
            field=models.TextField(),
        ),
    ]
