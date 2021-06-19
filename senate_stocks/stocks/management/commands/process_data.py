import re
from datetime import date

from stocks.models import Asset, Trade, Senator

# Converts date string from scrape to a python datetime object
def convert_date(d):
    s = d.split('/')
    return date(int(s[2]),int(s[0]),int(s[1]))


# Extracts ticker and misc. info from wonky asset names of trades
def fix_name(trade):
    ticker = trade[3].strip().upper()
    name = trade[4].strip()
    comments = ""

    # some trades, such as corporate bond trades, have "--" listed as the ticker
    # while the actual ticker is included in the asset name
    # if ticker == '--':
    match = re.match(r'^(\w{2,})[ ][-][ ](.*)$',name)
    if match:
        ticker = match.group(1).strip()
        name = match.group(2).strip()

    if 'Bond' in trade[5] or 'Municipal Security' == trade[5]:
        match = re.match(r'^(.*) (\w{2,}[ ]*\bRate\b.*)',name)
        if match:
            name = match.group(1).strip()
            comments += f'\n{match.group(2)}'
    if trade[5] in ("Non-Public Stock","Other Securities"):
        match = re.match(r'^(.*)[ ]*(\bCompany\b.*)[ ]*(\bDescription\b.*)$',name)
        if match:
            name = match.group(1).strip()
            comments += f'\n{match.group(2)}\n{match.group(3)}'
        else:
            match = re.match(r'^(.*)[ ]*(\bDescription\b.*)$',name)
            if match:
                name = match.group(1).strip()
                comments += f'\n{match.group(2)}'

    return (ticker, name, comments)


# Returns the relevant Asset instance for a given trade
# If the Asset isn't in db yet, create it
def get_asset(ticker, name):
    asset_results = None
    if ticker == '--':
        if len(name) <= 5:
            asset_results = Asset.objects.filter(ticker__iexact=name)

        if not asset_results:
            asset_results = Asset.objects.filter(name__icontains=name)
    else:
        # using the ticker, check if there's already an entry for this asset
        asset_results = Asset.objects.filter(ticker__iexact=ticker)

    # if so, link this trade to that Asset model
    # otherwise, make a new Asset entry in db and link
    if asset_results:
        asset = asset_results[0]
    else:
        asset = Asset(ticker=ticker,name=name)

        try:
            pass
            asset.save()
        except Exception as e:
            print(f'Exception while saving asset: {asset.ticker} {asset.name}')
            print(e)
    print(f'Asset: {asset}')
    return asset


# Returns relevant Senator instance for a given first and last name
# Creates one if Senator not yet in db
def get_senator(first_name, last_name):
    results = Senator.objects.filter(first_name=first_name,last_name=last_name)
    if not results:
        senator = Senator(first_name=first_name,last_name=last_name)
        try:
            senator.save()
        except:
            print("Exception!")
    else:
        senator = results[0]

    return senator


# Takes a single raw trade, parses it, and saves as a Trade instance in db
def save_trade(entry, trade, senator, asset, comments):
    # Extract data from raw trade string

    trade_entry = Trade(transaction_date=convert_date(trade[1]),
                        senator=senator,
                        owner=trade[2],
                        ticker=asset.ticker,
                        asset=asset,
                        asset_name=asset.name,
                        asset_type=trade[5],
                        transaction_type=trade[6],
                        amount=trade[7],
                        comments=f'{trade[8]} {comments}',
                        url=entry.url,
                        )

    try:
        pass
        trade_entry.save()
    except Exception as e:
        print("Exception!")
        print(e)

    print(f'{trade_entry}\n')


# Parses all trades and saves to db
def save_trades(trades_dict):
    print(trades_dict.items())
    for senator_name, frame_list in trades_dict.items():
        # Extract info from raw trade data
        for entry in frame_list:
            for trade in entry.frame.iloc:
                senator = get_senator(entry.first_name,entry.last_name)
                ticker, name, comments = fix_name(trade)
                print(f'Ticker: {ticker}, Name: {name}, Comments: {comments}')
                asset = get_asset(ticker,name)
                save_trade(entry,trade,senator,asset,comments)
