from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('senators/', views.senators, name='senators'),
    path('senator/<int:senator_id>', views.senator_detail, name='senator_detail'),
    path('trades/companies/<str:ticker>', views.ticker_detail, name='ticker_detail'),
    path('trades/companies', views.trade_companies, name='trade_companies')
]
