# Generated by Django 3.1.5 on 2021-02-09 20:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('stocks', '0013_auto_20200705_1315'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trade',
            name='transaction_date',
            field=models.DateField(),
        ),
    ]
