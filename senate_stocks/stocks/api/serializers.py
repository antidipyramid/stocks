# Contains serializers for Django REST framework
from rest_framework import serializers
from stocks.models import Senator, Trade, Asset

class TradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trade
        fields = ('id','transaction_date','senator','owner','ticker',
                  'asset_name','asset_type','transaction_type',
                  'amount','comments',)

class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = ('ticker', 'name')

class SenatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Senator
        fields = ('first_name','last_name')

class SearchSerializer(serializers.Serializer):
    assets = AssetSerializer(many=True)
    senators = SenatorSerializer(many=True)
