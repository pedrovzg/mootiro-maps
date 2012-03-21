# -*- coding: utf-8 -*-
from datetime import datetime
from haystack import indexes
from haystack import site
from komoo_resource.models import Resource


class ResourceIndex(indexes.RealTimeSearchIndex):
    text = indexes.CharField(document=True, use_template=True)
    name = indexes.EdgeNgramField(model_attr='name', boost=2.0)
    creator = indexes.CharField(model_attr='creator', null=True)
    creation_date = indexes.DateTimeField(model_attr='creation_date')
    description = indexes.CharField(model_attr='description', null=True)

    def index_queryset(self):
        """Used when the entire index for model is updated."""
        return Resource.objects.filter(creation_date__lte=datetime.now())

site.register(Resource, ResourceIndex)