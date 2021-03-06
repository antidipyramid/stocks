from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework import permissions
from stocks.models import Trade, Senator, Asset
from .serializers import TradeSerializer, SearchSerializer
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
