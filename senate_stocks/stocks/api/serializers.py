# Contains serializers for Django REST framework
from rest_framework import serializers
from stocks.models import Senator, Trade, Asset

class TradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trade
        fields = ('id','transaction_date','senator','owner','ticker',
                  'asset','asset_name','asset_type','transaction_type',
                  'amount','comments',)

class AssetSerializer(serializers.ModelSerializer):
    asset_related_trades = serializers.StringRelatedField(many=True)

    class Meta:
        model = Asset
        fields = ('id','ticker', 'name', 'asset_related_trades')

class SenatorSerializer(serializers.ModelSerializer):
    related_trades = TradeSerializer(many=True,read_only=True)

    class Meta:
        model = Senator
        fields = ('id','first_name','last_name','related_trades')

class SearchSerializer(serializers.Serializer):
    assets = AssetSerializer(many=True)
    senators = SenatorSerializer(many=True)
