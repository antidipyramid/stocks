from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework import permissions
from stocks.models import Trade, Senator, Asset
from .serializers import TradeSerializer, SearchSerializer, SenatorSerializer, AssetSerializer
from django.db.models import Q

from collections import namedtuple
from datetime import date, timedelta


class TradeListApiView(APIView):

    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        print("HELLO")
        thirty_days_ago = date.today() - timedelta(days=60)

        queryset = Trade.objects.filter(transaction_date__gte=thirty_days_ago)
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

class SenatorViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing the senator models.
    """
    queryset = Senator.objects.all()
    serializer_class = SenatorSerializer

    def list(self, request):
        serializer = self.serializer_class(self.queryset,many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        senator = get_object_or_404(self.queryset,pk=pk)
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
