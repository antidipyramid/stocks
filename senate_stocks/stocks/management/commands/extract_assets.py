from django.core.management.base import BaseCommand, CommandError
from stocks.models import Trade, Asset

class Command(BaseCommand):
    help = 'Extracts asset info from trade and adds it as an Asset instance in the db'

    """
    Check each trade, if asset isn't already in database, add it
    """
    def handle(self, *args, **options):

        trades = Trade.objects.all()
        for trade in trades:
            ticker = trade.ticker.strip()
            print(Trade.objects.filter(ticker=ticker))
            if not Asset.objects.filter(ticker=ticker):
                new_asset = Asset(ticker=ticker,
                                  name=trade.asset_name.strip())
                print(new_asset)
                try:
                    new_asset.save()
                except:
                    print("Exception for: " + trade)
