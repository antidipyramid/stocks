from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic.base import TemplateView
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('senators/', views.senators, name='senators'),
    path('senator/<int:senator_id>', views.senator_detail, name='senator_detail'),
    path('company_search/', views.company_search, name='company_search'),
    path('api/', include('stocks.api.urls')),
    path('assets/', views.assets, name='assets'),
    path('asset/<int:asset_id>', views.asset_detail, name='asset_detail'),
    path('faq/', views.faq, name='faq'),
]
