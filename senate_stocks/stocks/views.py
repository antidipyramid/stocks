from django.shortcuts import render
from django.db.models import Q
from collections import defaultdict as defaultdict
from django.http import HttpResponse
from .models import Senator, Trade
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd

def index(request):
    return render(request, 'stocks/index.html')

def about(request):
    return render(request, 'stocks/about.html')

def senators(request):
    context = {'senators': Senator.objects.all()}
    return render(request, 'stocks/senators.html', context)

def senator_detail(request, senator_id):
    return render(request,
                  'stocks/senator_detail.html',
                  {'trades': Trade.objects.filter(senator=senator_id),
                   'senator': Senator.objects.get(id=senator_id)})

def trade_companies(request):
    return render(request,
                  'stocks/trade_companies.html',
                  {'companies': Trade.objects.order_by('ticker').distinct('ticker')})

def company_search(request, terms):
    q = Trade.objects.order_by('ticker').distinct('ticker')
    q = q.filter(Q(ticker__icontains=terms) | Q(asset_name__icontains=terms))

    return render(request,
                  'stocks/company_search.html',
                  {'results': q})

def ticker_detail(request, ticker):
    trades = Trade.objects.filter(ticker=ticker.upper())

    senators = defaultdict(int)
    for trade in trades:
        senators[str(trade.senator)] += 1

    senator_list = list(senators.keys())
    fig = go.Figure([go.Bar(x=senator_list,y=[senators[x] for x in senator_list])])

    fig.update_layout(title=f'Senators Who Have Traded {trades[0].asset_name}',
                      paper_bgcolor='rgba(0,0,0,0)')
    graph = fig.to_html(full_html=False,default_height=500)

    return render(request,
                  'stocks/ticker_detail.html',
                  {'trades': Trade.objects.filter(ticker=ticker.upper()),
                   'company_name': trades[0].asset_name,
                  'ticker': ticker.upper(),
                   'figure': graph})
