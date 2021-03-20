from datetime import date

from django.test import TestCase
from django.core.management import call_command

from stocks.models import Asset, Senator, Trade
from stocks.management.commands import process_data as p_d

from pandas import DataFrame as df

class ScrapeTest(TestCase):
    data = [['8', '02/12/2021', 'Spouse', 'GEMIX', 'Goldman Sachs Emerging Markets Equity Fund Institu', 
             'Other Securities', 'Purchase', '$1,001 - $15,000', '--'],
            ['1', '03/01/2021', 'Self', '--', 'W.L. Gore & Associates, Inc. Company: W.L. Gore & Associates, Inc. \
             (Newark, DE) Description: Advanced materials manufacturing', 'Non-Public Stock', 'Sale (Partial)',
             '$250,001 - $500,000', '--'],
            ['1', '03/03/2021', 'Spouse', 'WFC', 'Wells Fargo & Company', 'Stock', 'Purchase',
             '$1,001 - $15,000', 'Dividend Reinvestment'],
            ]

    def test_date_convert(self):
        test_date = '02/15/2020'
        expected_date = date(2020,2,15)
        self.assertEquals(p_d.convert_date(test_date),expected_date)

    def test_fix_name(self):
        test_name_1 = ['1', '03/01/2021', 'Self', '--',
                       'W.L. Gore & Associates, Inc. Company: W.L. Gore & Associates, Inc.  (Newark, DE) Description: Advanced materials manufacturing',
                       'Non-Public Stock', 'Sale (Partial)', '$250,001 - $500,000', '--']
        expected_result_1 = ('--', 'W.L. Gore & Associates, Inc.',
                             '\nCompany: W.L. Gore & Associates, Inc.  (Newark, DE) \nDescription: Advanced materials manufacturing')
        expected_result_2 = ('LII', 'Lennox International Inc.',
                             '\n526107AF4  Rate/Coupon: 1.700% Matures: 08/01/27')
        test_name_2 = ['','','','--',
                       'LII - Lennox International Inc. 526107AF4  Rate/Coupon: 1.700% Matures: 08/01/27',
                       'Corporate Bond']
        test_name_3 = ['','','','--','Empire Petroleum Partners LLC  Company: Empire Petroleum Partners LLC  (Gaithersburg, MD)  Description: Energy Company','Other Securities']
        expected_result_3 = ('--','Empire Petroleum Partners LLC', '\nCompany: Empire Petroleum Partners LLC  (Gaithersburg, MD)  \nDescription: Energy Company')


        self.assertEquals(p_d.fix_name(test_name_1),expected_result_1)
        self.assertEquals(p_d.fix_name(test_name_2),expected_result_2)
        self.assertEquals(p_d.fix_name(test_name_3),expected_result_3)
