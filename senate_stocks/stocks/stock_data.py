import requests
import json

def get_data(ticker):
    base = 'https://www.alphavantage.co/query?'
    function = 'function=TIME_SERIES_DAILY_ADJUSTED'
    symbol = f'symbol={ticker}'
    output = 'outputsize=full'
    api = 'apikey=VGQHIZC6NX77S7W9'
    r = requests.get(f'{base}{function}&{symbol}&{output}&{api}')

    return r.json()
