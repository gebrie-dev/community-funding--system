# Generated by Django 5.0.6 on 2025-05-29 18:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('campaigns', '0002_alter_campaign_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='campaign',
            name='category',
            field=models.CharField(choices=[('EDUCATION', 'Education'), ('SOCIAL_IMPACT', 'Social Impact'), ('EMERGENCY', 'Emergency'), ('MEDICAL', 'Medical')], max_length=20),
        ),
    ]
