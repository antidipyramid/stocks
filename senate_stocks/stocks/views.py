from django.shortcuts import render
from django.http import HttpResponse
from .models import Senator, Trade
# Create your views here.

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

def ticker_detail(request, ticker):
    return render(request,
                  'stocks/ticker_detail.html',
                  {'trades': Trade.objects.filter(ticker=ticker.upper()),
                  'ticker': ticker.upper()})
