# Contains serializers for Django REST framework
from rest_framework import serializers
from stocks.models import Senator, Trade, Asset
from django.shortcuts import get_object_or_404
from django.http import Http404

class TradeSerializer(serializers.ModelSerializer):
    senator = serializers.StringRelatedField()
    senator_id = serializers.PrimaryKeyRelatedField(source="senator",read_only=True)
    senator_party = serializers.SerializerMethodField()
    senator_state = serializers.SerializerMethodField()

    class Meta:
        model = Trade
        fields = ('id','transaction_date','senator_id','senator', 'senator_state', 'senator_party', 'owner','ticker',
                  'asset','asset_name','asset_type','transaction_type',
                  'amount','comments','url',)

    def get_senator_party(self, obj):
        # return Senator.objects.get(obj.senator_id).party
        return get_object_or_404(Senator, pk=obj.senator_id).party

    def get_senator_state(self, obj):
        # return Senator.objects.get(obj.senator_id).state
        return get_object_or_404(Senator, pk=obj.senator_id).state

class AssetDetailSerializer(serializers.ModelSerializer):
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

class AssetSerializer(serializers.ModelSerializer):
    # asset_related_trades = TradeSerializer(many=True)
    count = serializers.SerializerMethodField()
    latest = serializers.SerializerMethodField()
    last_senator = serializers.SerializerMethodField()

    class Meta:
        model = Asset
        fields = ('id','ticker', 'name', 'count', 'latest', 'last_senator')

    def get_count(self, obj):
        return obj.asset_related_trades.count()

    def get_latest(self, obj):
        if obj.asset_related_trades.count() == 0:
            return 'None'

        try:
            result = obj.asset_related_trades.latest('transaction_date').transaction_date
        except:
            raise Http404("No matches found")

        return result

    def get_last_senator(self, obj):
        if obj.asset_related_trades.count() == 0:
            return 'None'

        return str(obj.asset_related_trades.latest('transaction_date').senator)

class SenatorSerializer(serializers.ModelSerializer):
    # related_trades = TradeSerializer(many=True,read_only=True)
    latest = serializers.SerializerMethodField()
    count = serializers.SerializerMethodField()

    class Meta:
        model = Senator
        fields = ('id','first_name','last_name', 'photo_url', 'state', 'party', 'latest', 'count')

    def get_count(self, obj):
        return obj.related_trades.count()

    def get_latest(self, obj):
        try:
            result = obj.related_trades.latest('transaction_date')
        except:
            raise Http404("No matches found")

        return TradeSerializer(result).data

class SenatorDetailSerializer(serializers.ModelSerializer):
    related_trades = TradeSerializer(many=True,read_only=True)
    latest = serializers.SerializerMethodField()
    count = serializers.SerializerMethodField()

    class Meta:
        model = Senator
        fields = ('id','first_name','last_name', 'photo_url', 'state', 'party', 'latest', 'count', 'related_trades')

    def get_count(self, obj):
        return obj.related_trades.count()

    def get_latest(self, obj):
        try:
            result = obj.related_trades.latest('transaction_date')
        except:
            raise Http404("No matches found")

        return TradeSerializer(result).data

class SearchSerializer(serializers.Serializer):
    assets = AssetSerializer(many=True)
    senators = SenatorSerializer(many=True)
