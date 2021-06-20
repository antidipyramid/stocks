from django.db import models
from localflavor.us.us_states import US_STATES
from localflavor.us.models import USStateField

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
    state = USStateField(max_length=2,choices=US_STATES,default="AK")
    #incumbent = models.CharField(max_length=1,choices=Answer.choices)

    party = models.CharField(max_length=4,choices=PartyChoices.choices,default=PartyChoices.INDEPENDENT)

    photo_url = models.URLField(default="")

    @property
    def trades():
        return Trade.objects.filter(senator=self)


    def __str__(self):
        if len(self.first_name.split(" ")[-1]) == 1:
            return f'{self.first_name}. {self.last_name}'
        else:
            return f'{self.first_name} {self.last_name}'

class Asset(models.Model):
    ticker = models.CharField(max_length=5)
    name = models.TextField()

    def __str__(self):
        return f'{self.name}'

class Trade(models.Model):

    transaction_date = models.DateField()
    senator = models.ForeignKey('Senator',
                                related_name="related_trades",
                                on_delete=models.CASCADE,default=1)
    '''
    class TradeOwner(models.TextChoices):
        SELF = 'S', _('Self')
        SPOUSE = 'SP', _('Spouse')
        JOINT = 'J', _('Joint')

    owner = models.CharField(max_length=6,
                             choices=TradeOwner.choices)
    '''

    owner = models.CharField(max_length=10)
    asset = models.ForeignKey(Asset,
                              related_name='asset_related_trades',
                              on_delete=models.CASCADE,null=True)
    ticker = models.CharField(max_length=5)
    asset_name = models.TextField()

    '''
    class AssetType(models.TextChoices):
        STOCK = 'ST', _('Stock')
        MUNSEC = 'MS', _('Municipal Security')
        OTHER = 'O', _('Other Security')
        CORPBOND = 'CB', _('Corporate Bond')

    asset_type = models.CharField(max_length=10,
                                  choices=AssetType.choices)
    '''
    asset_type = models.CharField(max_length=25)
    '''
    class TransactionType(models.TextChoices):
        PURCHASE = 'P', _('Purchase')
        FULL_SALE = 'FS', _('Sale (Full)')
        PART_SALE = 'PS', _('Sale (Partial)')

    transaction_type = models.CharField(max_length=10,
                                        choices=TransactionType.choices)
    '''
    transaction_type = models.CharField(max_length=20)

    '''
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
    '''

    amount = models.CharField(max_length=45)

    comments = models.TextField()

    url = models.URLField()

    def __str__(self):
        return f'{self.transaction_date} {self.ticker} {self.asset_name} {self.amount}'
