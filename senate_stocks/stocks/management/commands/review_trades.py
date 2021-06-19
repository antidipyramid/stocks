from django.core.management.base import BaseCommand, CommandError
from django.core.exceptions import ObjectDoesNotExist
from stocks.models import Asset, Trade, Senator

class Command(BaseCommand):
    help = 'Steps through trades with no ticker to manually edit them'

    def handle(self, *args, **options):
        for i, trade in enumerate( Trade.objects.filter(ticker='--') ):

            if trade.asset_type in ('Municipal Security','Non-Public Stock'):
                continue

            print(f'\nTrade {i}/{Trade.objects.filter(ticker="--").count()}')
            while True:
                for field in trade._meta.fields:
                    field_str = str( field ).split('.')[-1]
                    print(f'{field_str}: {getattr(trade,field_str)}')

                selection = input("\nChange asset (Y/N)?")
                if selection == "Y":
                    asset_id = input("New Asset ID?")
                    try:
                        asset = Asset.objects.get(id=asset_id)
                    except Asset.DoesNotExist:
                        print("Asset not found.")
                        continue

                    print(asset)
                    correctAsset = input("Correct asset (Y/N)?")
                    if correctAsset == "Y":
                        trade.asset = asset
                        trade.ticker = asset.ticker
                        trade.asset_name = asset.name
                        trade.save(update_fields=['asset','asset_name','ticker'])
                else:
                    break

