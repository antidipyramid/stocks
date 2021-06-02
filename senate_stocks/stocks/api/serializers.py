# Contains serializers for Django REST framework
from rest_framework import serializers
from stocks.models import Senator, Trade, Asset
from django.shortcuts import get_object_or_404
from django.http import Http404

class TradeSerializer(serializers.ModelSerializer):
    senator = serializers.StringRelatedField()
    senator_id = serializers.PrimaryKeyRelatedField(source="senator",read_only=True)

    class Meta:
        model = Trade
        fields = ('id','transaction_date','senator_id','senator','owner','ticker',
                  'asset','asset_name','asset_type','transaction_type',
                  'amount','comments','url',)

class AssetSerializer(serializers.ModelSerializer):
    asset_related_trades = TradeSerializer(many=True)
    count = serializers.SerializerMethodField()
    latest = serializers.SerializerMethodField()
    last_senator = serializers.SerializerMethodField()

    class Meta:
        model = Asset
        fields = ('id','ticker', 'name', 'count', 'latest', 'last_senator', 'asset_related_trades')

    def get_count(self, obj):
        return obj.asset_related_trades.count()

    def get_latest(self, obj):
        try:
            result = obj.asset_related_trades.latest('transaction_date').transaction_date
        except:
            raise Http404("No matches found")

        return result

    def get_last_senator(self, obj):
        return str(obj.asset_related_trades.latest('transaction_date').senator)

class SenatorSerializer(serializers.ModelSerializer):
    related_trades = TradeSerializer(many=True,read_only=True)

    class Meta:
        model = Senator
        fields = ('id','first_name','last_name','related_trades')

class SearchSerializer(serializers.Serializer):
    assets = AssetSerializer(many=True)
    senators = SenatorSerializer(many=True)
