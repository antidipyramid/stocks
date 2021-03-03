from collections import defaultdict

import plotly.graph_objects as go
import plotly.express as px
import pandas as pd
from rest_framework import generics
from psycopg2.extras import DateRange

from django.shortcuts import render
from django.db.models import Q
from django.http import HttpResponse
from django.views.decorators.cache import cache_page
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .forms import CompanySearchForm
from .models import Senator,Trade
from .stock_data import get_data
"""
View for the homepage

Contains the first graph(s) the user sees: a bubble chart that displays the traded
companies for a user-defined duration by date, # of transactions, and total trade volume
"""
def index(request):
    def convert_date(date):
        s = date.split('/')
        return '-'.join([s[2],s[0],s[1]])


    #Get trades by company
    companies = Trade.objects.all().distinct('ticker')
    senators = Trade.objects.all().distinct('senator')
    """
    #Store lower bound for transaction value per company in dicyt
    value = defaultdict(int)
    for trade in trades:
        #Strip out all commas and dollars signs from lower bound
        amt = int(trade.amount.split(" ")[0]
                  .translate({36: None, 44: None}))
        value[trade.ticker] += amt


    #Get dates
    dates = []
    for trade in trades:
        dates.append(convert_date(trade.transaction_date))

    fig = go.Figure(data=[go.Scatter(x=dates,
                                     y=)])

    """

    activity = []
    for senator in Senator.objects.all():
        activity.append(len(Trade.objects.all().filter(senator=senator)))

    fig1 = go.Figure(go.Bar(y=[str(x) for x in Senator.objects.all()],
                            x=activity,
                            orientation='h'))

    fig1.update_layout(title='Most Active Senators',
                      paper_bgcolor='rgba(0,0,0,0)',
                      plot_bgcolor='rgba(0,0,0,0)',
                        yaxis=dict(
                            showgrid=False,
                            showline=False,
                            showticklabels=True),
                       xaxis=dict(
                            showgrid=False,
                            showline=False,
                            showticklabels=False))
    
    senators_by_activity = fig1.to_html(full_html=False,default_height=500)


    return render(request, 'stocks/index.html',
                  {'most_active_senators': senators_by_activity})

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

def company_search(request):
    query = request.GET.get('q')
    q = Trade.objects.order_by('ticker').distinct('ticker')
    q = q.filter(Q(ticker__icontains=query) | Q(asset_name__icontains=query))
    print(q)
    return render(request,
                  'stocks/company_search.html',
                  {'results': q})

# Cache page every 24 hours
@cache_page(60 * 60 * 24)
def ticker_detail(request, ticker):

    def convert_date(date):
        s = date.split('/')
        return '-'.join([s[2],s[0],s[1]])

    trades = Trade.objects.filter(ticker=ticker.upper())

    senators = defaultdict(int)
    for trade in trades:
        senators[str(trade.senator)] += 1

    senator_list = list(senators.keys())
    fig = go.Figure(data=[go.Bar(y=senator_list,
                            x=[senators[x] for x in senator_list],
                            orientation='h')],
                    layout=go.Layout(height=500,width=1000,xaxis=dict(tickformat='d')))

    fig.update_layout(title=f'Senators Who Have Traded {trades[0].asset_name}',
                      paper_bgcolor='rgba(0,0,0,0)',
                      plot_bgcolor='rgba(0,0,0,0)',
                      yaxis=dict(
                            showgrid=False,
                            showline=False,
                            showticklabels=True),
                       xaxis=dict(
                            showgrid=False,
                            showline=False,
                            showticklabels=False))
    graph = fig.to_html(full_html=False,default_height=500)


    d = get_data(ticker)
    price_dict = d['Time Series (Daily)']
    dates = list(price_dict.keys())

    fig2 = go.Figure(data=[go.Scatter(x=dates,
                                 y=[price_dict[date]['4. close'] for date in dates])],
                     layout=go.Layout(height=500,width=1000))

    fig2.update_layout(title=f'{trades[0].asset_name}\'s Price History',
                     paper_bgcolor='rgba(0,0,0,0)',
                       plot_bgcolor='rgba(0,0,0,0)',
                       xaxis_range=['2012-01-01','2021-12-12'],
                       yaxis=dict(
                            showgrid=False,
                            showline=False,
                            showticklabels=True),
                       xaxis=dict(
                            showgrid=False,
                            showline=False,
                            showticklabels=False))

    trade_dates = [x.transaction_date for x in trades]

    fig2.add_trace(go.Scatter(x=trade_dates,
                              y=[price_dict[x]['4. close'] for x in trade_dates],
                              text=[x for x in trades],
                              hovertemplate = 'Senator: %{text}',
                              mode='markers'))
    fig2.update_layout(hovermode='x unified')

    graph2 = fig2.to_html(full_html=False,default_height=500)


    senator_obj = trades.distinct('senator')

    return render(request,
                  'stocks/ticker_detail.html',
                  {'trades': Trade.objects.filter(ticker=ticker.upper()),
                   'senators': senator_list,
                   'senator_obj': senator_obj,
                   'company_name': trades[0].asset_name,
                   'ticker': ticker.upper(),
                   'figure': graph,
                   'figure2': graph2})

