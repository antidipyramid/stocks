import requests
import re

import pandas as pd
from stocks.models import Trade, Senator, Asset
from django.core.management.base import BaseCommand, CommandError

from ._scraper import SenateDataScraper
from .process_data import fix_name, convert_date, save_trades


class Command(BaseCommand):
    help = 'Scrapes new stock trades and adds them to the database'

    def add_arguments(self, parser):
        parser.add_argument('start_date', type=str)
        parser.add_argument('end_date', type=str)

    def handle(self, *args, **options):
        # Just make sure the input is in MM/DD/YYYY HH:MM:SS format
        validStartInput = re.match(r'\d{2}/\d{2}/\d{4} \d{2}:\d{2}:\d{2}',
                        options['start_date'])
        validEndInput = re.match(r'\d{2}/\d{2}/\d{4} \d{2}:\d{2}:\d{2}',
                        options['end_date'])

        if not (validStartInput and validEndInput):
            raise CommandError('Invalid input! Dates must be in form \'MM/DD/YYYY HH:MM:SS\'')
            return

        start_date, end_date = options['start_date'], options['end_date']

        self.stdout.write(self.style.SUCCESS(f'Start date is {start_date}'))

        with requests.Session() as session:
            scraper = SenateDataScraper(session=session,
                                        start_date=start_date,
                                        end_date=end_date)

            trades_dict = scraper.scrape()
            save_trades(trades_dict)
