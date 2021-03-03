# Contains serializers for Django REST framework
from rest_framework import serializers
from stocks.models import Senator, Trade

class TradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trade
        fields = ('id','transaction_date','senator','owner','ticker',
                  'asset_name','asset_type','transaction_type',
                  'amount','comments',)
