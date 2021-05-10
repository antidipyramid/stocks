# Contains serializers for Django REST framework
from rest_framework import serializers
from stocks.models import Senator, Trade, Asset

class TradeSerializer(serializers.ModelSerializer):
    senator = serializers.StringRelatedField()
    senator_id = serializers.PrimaryKeyRelatedField(source="senator",read_only=True)

    class Meta:
        model = Trade
        fields = ('id','transaction_date','senator_id','senator','owner','ticker',
                  'asset','asset_name','asset_type','transaction_type',
                  'amount','comments','url',)

class AssetSerializer(serializers.ModelSerializer):
    # asset_related_trades = serializers.StringRelatedField(many=True)
    count = serializers.SerializerMethodField()
    latest = serializers.SerializerMethodField()

    class Meta:
        model = Asset
        fields = ('id','ticker', 'name', 'count', 'latest')

    def get_count(self, obj):
        return obj.asset_related_trades.count()

    def get_latest(self, obj):
        return obj.asset_related_trades.latest('transaction_date').transaction_date

class SenatorSerializer(serializers.ModelSerializer):
    related_trades = TradeSerializer(many=True,read_only=True)

    class Meta:
        model = Senator
        fields = ('id','first_name','last_name','related_trades')

class SearchSerializer(serializers.Serializer):
    assets = AssetSerializer(many=True)
    senators = SenatorSerializer(many=True)
