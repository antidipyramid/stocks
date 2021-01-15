from django import forms

class CompanySearchForm(forms.Form):
    query = forms.CharField(label='Search by name or ticker abbreviation',
                            max_length=25, required=True)

