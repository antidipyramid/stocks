from collections import defaultdict
import re
import json
from datetime import date, timedelta

import pandas as pd
from rest_framework import generics
from psycopg2.extras import DateRange
from localflavor.us.us_states import US_STATES as states

from django.shortcuts import render
from django.db.models import Q
from django.http import HttpResponse
from django.views.decorators.cache import cache_page
from django.core import serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .api.serializers import TradeSerializer

from .forms import CompanySearchForm
from .models import Senator, Trade, Asset
from .stock_data import get_data
"""
View for the homepage

Contains the first graph(s) the user sees: a bubble chart that displays the traded
companies for a user-defined duration by date, # of transactions, and total trade volume
"""
def index(request):
    return render(request, 'stocks/index.html', {'page_title': 'Stock Tracker'})

def about(request):
    return render(request, 'stocks/about.html', {'page_title': 'About | Stock Tracker'})

def senators(request):
    return render(request, 'stocks/senators.html', {'page_title': 'Senators | Stock Tracker'})

def assets(request):
    return render(request, 'stocks/assets.html', {'page_title': 'Assets | Stock Tracker'})

def asset_detail(request, asset_id):
    return render(request,
                  'stocks/asset_detail.html',
                  {'page_title': f'{Asset.objects.get(id=asset_id).name} | Stock Tracker'})

def senator_detail(request, senator_id):
    return render(request,
                  'stocks/senator_detail.html',
                  {'page_title': f'{Senator.objects.get(id=senator_id)} | Stock Tracker'})

def company_search(request):
    query = request.GET.get('q')
    q = Trade.objects.order_by('ticker').distinct('ticker')
    q = q.filter(Q(ticker__icontains=query) | Q(asset_name__icontains=query))
    print(q)
    return render(request,
                  'stocks/company_search.html',
                  {'results': q})

