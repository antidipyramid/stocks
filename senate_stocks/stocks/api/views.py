from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework import permissions
from stocks.models import Trade, Senator, Asset
from .serializers import TradeSerializer, SearchSerializer, SenatorSerializer, AssetSerializer
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
import django_filters as filters

from collections import namedtuple
from datetime import date, timedelta


class TradeListApiView(APIView):

    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        print("HELLO")
        thirty_days_ago = date.today() - timedelta(days=60)

        queryset = Trade.objects.filter(transaction_date__month=2).filter(transaction_date__year=2021)
        serializer = TradeSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AssetViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing asset models.
    """
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer

    def list(self, request):
        serializer = self.serializer_class(self.queryset,many=True)
        return Response(serializer.data)

    def retrive(self, request, pk=None):
        asset = get_object_or_404(self.queryset,pk=pk)
        serializer = AssetSerializer(asset)
        return Response(serializer.data)

"""
class SenatorListApiView(APIView):

    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        queryset = Senator.objects.all()
        serializer = SenatorSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
"""

class SenatorFilter(filters.FilterSet):
    first_name = filters.CharFilter(lookup_expr='icontains')
    last_name = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Senator
        fields = ('first_name', 'last_name')

class SenatorViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing the senator models.
    """
    queryset = Senator.objects.all()
    serializer_class = SenatorSerializer
    filterset_class = SenatorFilter

    def filter_queryset(self,queryset):
        filter_backends = [DjangoFilterBackend]
        for backend in list(filter_backends):
            queryset = backend().filter_queryset(self.request,queryset,view=self)

        return queryset

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer_class()(self.filter_queryset(queryset),many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = self.get_queryset()
        senator = get_object_or_404(queryset,pk=pk)
        serializer = SenatorSerializer(senator)
        return Response(serializer.data)

class SearchApiViewSet(viewsets.ViewSet):
    """
    This viewset searches for the provided query among the senators and companies
    and puts the results in a neat little object for the serializer to parse
    """
    permission_classes = [permissions.IsAuthenticated]
    def list(self, request, query):
        print(query)
        Results = namedtuple('Results', ('senators','assets'))
        results = Results(senators=Senator.objects.filter(
                        Q(first_name__icontains=query) | Q(last_name__icontains=query)),
                    assets=Asset.objects.filter(
                        Q(ticker__icontains=query) | Q(name__icontains=query)))
        serializer = SearchSerializer(results)
        return Response(serializer.data)
