# Generated by Django 2.2.5 on 2020-03-10 17:18

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('administracion', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pago',
            name='fecha_registro',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='Fecha de registro'),
        ),
        migrations.AlterField(
            model_name='ticket',
            name='codigo_qr',
            field=models.TextField(),
        ),
    ]