import requests
import re
import pandas as pd
from stocks.models import Trade, Senator
from django.core.management.base import BaseCommand, CommandError
from ._scraper import SenateDataScraper

import pdb


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

            trades_dict = scraper.scrape()
            for senator, frame_list in trades_dict.items():
                *last_name, first_name = senator.split(',')
                print(f'{" ".join(last_name)} {first_name}')

                results = Senator.objects.filter(
                            first_name=first_name, 
                            last_name=" ".join(last_name))

                if not results:
                    senator_entry = Senator(first_name=first_name,
                                            last_name=" ".join(last_name))

                    senator_entry.save()
                '''
                for frame in frame_list:
                    for trade in frame.iloc:
                        if Senator.objects.filter(first_name=se)

                        print(trade)
                        entry = Trade(transaction_date=trade[1],
                                      owner=trade[2],
                                      ticker=trade[3],
                                      asset_name=trade[4],
                                      asset_type=trade[5],
                                      transaction_type=trade[6],
                                      amount=trade[7],
                                      comments =trade[8],
                                      )
                        print(entry)
                        '''
