from django.conf.urls import url
from django.urls import re_path, path, include
from .views import TradeListApiView, SearchApiViewSet, SenatorViewSet, AssetViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('senators', SenatorViewSet, basename='senator')
router.register('assets', AssetViewSet, basename='asset')

urlpatterns = [
    path('', TradeListApiView.as_view()),
    path('search/<str:query>/', SearchApiViewSet.as_view({'get':'list'})),
]

urlpatterns.extend(router.urls)
