from django.conf.urls import url
from django.urls import path, include
from .views import TradeListApiView

urlpatterns = [
    path('', TradeListApiView.as_view()),
]
