from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet,
    TagViewSet,
    ArticleViewSet,
    ArticleContentViewSet,
    CommentViewSet,
    ArticleManagerViewSet,
    CommentManagerViewSet
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'tags', TagViewSet)
router.register(r'articles', ArticleViewSet)
router.register(r'article-contents', ArticleContentViewSet)
router.register(r'comments', CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('article-manager/', ArticleManagerViewSet.as_view({
        'get': 'retrieve',
        'post': 'create',
        'put': 'update',
        'patch': 'update',
        'delete': 'destroy'
    })),
    path('comment-manager/', CommentManagerViewSet.as_view({
        'get': 'retrieve',
        'post': 'create',
        'put': 'update',
        'patch': 'update',
        'delete': 'destroy'
    })),
]