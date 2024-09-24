import django_filters
from .models import Article, Category, Tag

class ArticleFilter(django_filters.FilterSet):
    category = django_filters.ModelChoiceFilter(queryset=Category.objects.all())
    tags = django_filters.ModelMultipleChoiceFilter(queryset=Tag.objects.all())
    keyword = django_filters.CharFilter(method='filter_keyword')

    class Meta:
        model = Article
        fields = ['category', 'tags']

    def filter_keyword(self, queryset, name, value):
        return queryset.filter(contents__title__icontains=value)