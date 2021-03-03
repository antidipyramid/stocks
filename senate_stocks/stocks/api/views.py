from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from stocks.models import Trade
from .serializers import TradeSerializer
from datetime import date, timedelta

class TradeListApiView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, *args, **kwargs):
        print("HELLO")
        thirty_days_ago = date.today() - timedelta(days=60)

        print(str(thirty_days_ago))
        queryset = Trade.objects.filter(transaction_date__gte=thirty_days_ago)
        serializer = TradeSerializer(queryset, many=True)
        print(str(queryset))
        return Response(serializer.data, status=status.HTTP_200_OK)
