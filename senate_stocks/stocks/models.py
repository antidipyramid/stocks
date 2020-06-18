from django.db import models
from localflavor.us.models import USStateField
from django.utils.translation import gettext_lazy as _

# Create your models here.

class Senator(models.Model):
    class Answer(models.TextChoices):
        NO = 'N'
        YES = 'Y'

    class PartyChoices(models.TextChoices):
        REPUBLICAN = 'R'
        DEMOCRAT = 'D'
        INDEPENDENT = 'I'

    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    state = USStateField()
    incumbent = models.CharField(max_length=1,choices=Answer.choices)
    party = models.CharField(max_length=2,
                            choices=PartyChoices.choices)

    def __str__(self):
        return f'{self.first_name} {self.last_name} ({self.party}-{self.state})'

class Trade(models.Model):
    transaction_date = models.DateField()
    senator = models.ForeignKey('Senator',
                                on_delete=models.CASCADE,default=1)

    class TradeOwner(models.TextChoices):
        SELF = 'S'
        SPOUSE = 'SP'

    owner = models.CharField(max_length=6,
                             choices=TradeOwner.choices)

    ticker = models.CharField(max_length=5)
    asset_name = models.CharField(max_length=100)

    class AssetType(models.TextChoices):
        STOCK = 'ST', _('Stock')
        MUNSEC = 'MS', _('Municipal Security')
        OTHER = 'O', _('Other Security')
        CORPBOND = 'CB', _('Corporate Bond')

    asset_type = models.CharField(max_length=10,
                                  choices=AssetType.choices)

    class TransactionType(models.TextChoices):
        PURCHASE = 'P'
        SALE = 'S'

    transaction_type = models.CharField(max_length=5,
                                        choices=TransactionType.choices)

    class TransactionAmount(models.TextChoices):
        ONE = '1', _('1,001 - $15,000')
        TWO = '2', _('$15,001 - $50,000')
        THREE = '3', _( '$50,001 - $100,000')
        FOUR = '4', _('$100,001 - $250,001')
        FIVE = '5', _('$250,001 - $500,000')
        SIX = '6', _('$500,001 - $1,000,000')
        SEVEN = '7',  _('$1,000,001 - $5,000,000')
        EIGHT = '8', _('$5,000,001 - $25,000,000')
        NINE = '9', _('$25,000,001 - $50,000,000')
        TEN = '10', _('Over $50,000,000')

    amount = models.CharField(max_length=10,
                              choices=TransactionAmount.choices)

    comments = models.TextField()

