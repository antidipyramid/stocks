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
            name = trade.asset_name.strip()
            ticker = trade.ticker.strip()
            if ticker != "--":
                if Asset.objects.get(ticker__iexact=ticker):
                    trade.asset_id = Asset.objects.get(ticker__iexact).id
                else:
                    new_asset = Asset(ticker=ticker,
                                      name="")

                try:
                    new_asset.save()
                except:
                    print("Exception for: " + str(trade))

            elif not Asset.objects.filter(name=name):
                new_asset = Asset(ticker=trade.ticker.strip(),
                                  name=name)
                try:
                    new_asset.save()
                except:
                    print("Exception for: " + str(trade))    

            print(Asset.objects.get(name=name))
            trade.asset_id = Asset.objects.get(name=name).id
            trade.save() 
