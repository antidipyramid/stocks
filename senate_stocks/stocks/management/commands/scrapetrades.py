import requests
import re
import stocks.models
from django.core.management.base import BaseCommand, CommandError
from ._scraper import SenateDataScraper


class Command(BaseCommand):
    help = 'Scrapes new stock trades and adds them to the database'

    def add_arguments(self, parser):
        parser.add_argument('start_date', type=str)

    def handle(self, *args, **options):
        cond = re.match('\d{2}/\d{2}/\d{4} \d{2}:\d{2}:\d{2}',
                        options['start_date'])
        if not cond:
            raise CommandError('Invalid input')
            return

        start_date = options['start_date']

        self.stdout.write(self.style.SUCCESS(f'Start date is {start_date}'))

        with requests.Session() as session:
            scraper = SenateDataScraper(session=session,
                                        start_date=start_date)

            trades = scraper.scrape()
            print(trades)
            '''
            for trade in trades:
                entry = Trade(owner= ,
                              transaction_date= ,
                              senator= ,
                              ticker= ,
                              asset_name= ,
                              asset_type= ,
                              transaction_type= ,
                              amount= ,
                              comments = ,
                              )
                entry.save()
                print(trade)
                '''
