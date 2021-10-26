from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework import permissions
from rest_framework.filters import SearchFilter
from stocks.models import Trade, Senator, Asset
from .serializers import AssetDetailSerializer, SenatorDetailSerializer, TradeSerializer, SearchSerializer, SenatorSerializer, AssetSerializer
from .paginations import SenatorPagination, AssetPagination
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Max
import django_filters as filters

from collections import namedtuple
from datetime import date, timedelta
from functools import reduce


class TradeListApiView(APIView):

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    def get(self, request, *args, **kwargs):
        thirty_days_ago = date.today() - timedelta(days=60)

        queryset = Trade.objects.filter(transaction_date__month=2).filter(transaction_date__year=2021)
        serializer = TradeSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class AssetFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr='icontains')
    ticker = filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Asset
        fields = ('name', 'ticker')

class AssetViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing asset models.
    """
    serializer_class = AssetSerializer
    # filterset_class = AssetFilter
    filter_backends = [SearchFilter]
    search_fields = ['ticker','name']
    detail_serializer_class = AssetDetailSerializer
    pagination_class = AssetPagination

    # def filter_queryset(self,queryset):
    #     # filter_backends = [DjangoFilterBackend]
    #     for backend in list(filter_backends):
    #         queryset = backend().filter_queryset(self.request,queryset,view=self)

    #     return queryset

    def get_queryset(self):
        """Override to account for ordering (sorting)"""
        queryset = Asset.objects.annotate(count=Count('asset_related_trades')).annotate(latest=Max('asset_related_trades__transaction_date'))
        order = self.request.query_params.get('order')

        if order not in (None, '-'):
            queryset = queryset.order_by(order)
        return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            if hasattr(self, 'detail_serializer_class'):
                return self.detail_serializer_class

        return super(AssetViewSet,self).get_serializer_class()

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
    # queryset = Senator.objects.all()
    serializer_class = SenatorSerializer
    filterset_class = SenatorFilter
    filter_backends = [SearchFilter]
    search_fields = ['first_name','last_name']
    detail_serializer_class = SenatorDetailSerializer
    pagination_class = SenatorPagination

    # def get_queryset(self):
    #     queryset = Senator.objects.annotate()

    def get_queryset(self):
        queryset = Senator.objects.all()
        states = self.request.query_params.get('state', '')
        parties = self.request.query_params.get('party', '')

        if not states and not parties:
            pass
        else:
            if not states:
                # we need a Q statement that is always true
                # so if there's no query for this field, we can 
                # just move on
                state_query = ~Q(pk=None)
            else:
                state_query = Q(state__in=states.split('|'))

            if not parties:
                party_query = ~Q(pk=None)
            else:
                party_query = Q(party__in=parties.split('|'))

            queryset = queryset.filter(state_query & party_query)

        order = self.request.query_params.get('order')
        print(order)

        if order not in (None, '-'):
            queryset = Senator.objects.annotate(count=Count('related_trades')).annotate(latest=Max('related_trades__transaction_date'))
            queryset = queryset.order_by(order)

        return queryset

    # def filter_queryset(self,queryset):
    #     filter_backends = [DjangoFilterBackend]
    #     for backend in list(filter_backends):
    #         queryset = backend().filter_queryset(self.request,queryset,view=self)

    #     return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            if hasattr(self, 'detail_serializer_class'):
                return self.detail_serializer_class

        return super(SenatorViewSet,self).get_serializer_class()

class SearchApiViewSet(viewsets.ViewSet):
    """
    This viewset searches for the provided query among the senators and companies
    and puts the results in a neat little object for the serializer to parse
    """
    # permission_classes = [permissions.IsAuthenticated]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    def list(self, request, query):
        print(query)
        Results = namedtuple('Results', ('senators','assets'))
        results = Results(senators=Senator.objects.filter(
            Q(first_name__icontains=query) | Q(last_name__icontains=query)),
                          assets=Asset.objects.filter(
                              Q(ticker__icontains=query) | Q(name__icontains=query)))
        serializer = SearchSerializer(results)
        return Response(serializer.data)
