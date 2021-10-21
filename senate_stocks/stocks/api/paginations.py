from collections import defaultdict
from rest_framework.pagination import PageNumberPagination

class SenatorPagination(PageNumberPagination):
    def paginate_queryset(self, queryset, request, view=None):
        fields = ('state', 'party')
        self.aggregations = {}

        # we want to return an aggregations object that gives us the count of
        # how many senators in results are from AK, LA, FL, etc. for
        # filtering purposes
        for field in fields:
            field_counts = {}
            for result in queryset:
                val = getattr(result, field)
                if val in field_counts:
                    field_counts[val]['count'] += 1
                else:
                    field_counts[val] = {'value': val, 'count': 1}

            self.aggregations[field] = {'field': field, 'type':'value', 'data': field_counts.values()}




        return super(SenatorPagination, self).paginate_queryset(queryset, request, view)

    def get_paginated_response(self, data):
        paginated_response = super(SenatorPagination, self).get_paginated_response(data)
        paginated_response.data['aggregations'] = self.aggregations
        return paginated_response
