from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, TagViewSet, ArticleViewSet, 
    ArticleContentViewSet, CommentViewSet,
    ArticleManager, CommentManager, ArticleSearchManager
)

# Using DefaultRouter for the ViewSets
router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'articles', ArticleViewSet, basename='article')
router.register(r'contents', ArticleContentViewSet, basename='content')
router.register(r'comments', CommentViewSet, basename='comment')

# URLs for ArticleManager, CommentManager, and ArticleSearchManager
urlpatterns = [
    path('', include(router.urls)),  # Includes the ViewSets URLs
    
    # Custom actions for ArticleManager
    path('article/<int:article_id>/', ArticleManager().get, name='get_article'),
    path('article/create/', ArticleManager().create, name='create_article'),
    path('article/update/<int:article_id>/', ArticleManager().update, name='update_article'),
    path('article/delete/<int:article_id>/', ArticleManager().delete, name='delete_article'),
    
    # Custom actions for CommentManager
    path('comment/<int:comment_id>/', CommentManager().get, name='get_comment'),
    path('comment/create/', CommentManager().create, name='create_comment'),
    path('comment/update/<int:comment_id>/', CommentManager().update, name='update_comment'),
    path('comment/delete/<int:comment_id>/', CommentManager().delete, name='delete_comment'),
    
    # Search articles
    path('articles/search/', ArticleSearchManager().search, name='search_articles'),
]
