import requests
import re
from datetime import date

import pandas as pd
from stocks.models import Trade, Senator, Asset
from django.core.management.base import BaseCommand, CommandError

from ._scraper import SenateDataScraper
from .process_data import fix_name, convert_date, save_trades


class Command(BaseCommand):
    help = 'Scrapes new stock trades and adds them to the database'

    def add_arguments(self, parser):
        parser.add_argument('start_date', type=str)

    def handle(self, *args, **options):

        cond = re.match('\d{2}/\d{2}/\d{4} \d{2}:\d{2}:\d{2}',
                        options['start_date'])

        if not cond:
            raise CommandError('Invalid input! Date must be in form \'MM/DD/YYYY HH:MM:SS\'')
            return

        start_date = options['start_date']

        self.stdout.write(self.style.SUCCESS(f'Start date is {start_date}'))

        with requests.Session() as session:
            scraper = SenateDataScraper(session=session,
                                        start_date=start_date)

            trades_dict = scraper.scrape()
            save_trades(trades_dict)
