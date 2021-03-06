from django.conf.urls import url
from django.urls import re_path, path, include
from .views import TradeListApiView, SearchApiViewSet

urlpatterns = [
    path('', TradeListApiView.as_view()),
    path('search/<str:query>/', SearchApiViewSet.as_view({'get':'list'})),
]
