from django.db import models
from localflavor.us.models import USStateField

# Create your models here.

class Senator(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    state = USStateField()

    DEMOCRAT = 'D'
    REPUBLICAN = 'R'
    INDEPENDENT = 'I'
    PARTY_CHOICES = [
        (DEMOCRAT, 'Democrat'),
        (REPUBLICAN, 'Republican'),
        (INDEPENDENT, 'Independent')
    ]

    party = models.CharField(max_length=2, 
                            choices=PARTY_CHOICES)

    def __str__(self):
        return f'{self.first_name} {self.last_name} ({self.party}-{self.state})'
