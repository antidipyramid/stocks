from django.core.management.base import BaseCommand, CommandError
from stocks.models import Trade, Asset

class Command(BaseCommand):
    help = 'Clears all assets and trades from the database'

    def handle(self, *args, **options):
        Trade.objects.all().delete()
        Asset.objects.all().delete()

        self.stdout.write(self.style.SUCCESS('Successfully cleared all Trades and Assets from the database!'))
