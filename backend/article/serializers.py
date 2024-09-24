from rest_framework import serializers
from .models import Category, Tag, Article, ArticleContent, Comment

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'created_at']

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class ArticleContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleContent
        fields = ['id', 'language', 'title', 'body']

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'created_at']

class ArticleSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    tags = serializers.PrimaryKeyRelatedField(many=True, queryset=Tag.objects.all())
    contents = ArticleContentSerializer(many=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Article
        fields = ['id', 'author', 'category', 'tags', 'created_at', 'updated_at', 'contents','comments']

    def create(self, validated_data):
        contents_data = validated_data.pop('contents')
        tags_data = validated_data.pop('tags')
        article = Article.objects.create(**validated_data)
        for content_data in contents_data:
            ArticleContent.objects.create(article=article, **content_data)
        article.tags.set(tags_data)
        return article
    
