# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import generic
from django.core.urlresolvers import reverse

from lib.taggit.managers import TaggableManager
from fileupload.models import UploadedFile
import reversion

from main.utils import slugify
from community.models import Community


class ProjectRelatedObject(models.Model):
    project = models.ForeignKey('Project')

    # dynamic ref
    content_type = models.ForeignKey(ContentType, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = generic.GenericForeignKey('content_type', 'object_id')


class Project(models.Model):
    name = models.CharField(max_length=1024)
    slug = models.SlugField(max_length=1024)
    description = models.TextField()
    tags = TaggableManager()

    contributors = models.ManyToManyField(User, null=True, blank=True,
            related_name='project_contributors')
    community = models.ManyToManyField(Community, null=True, blank=True)
    contact = models.TextField(null=True, blank=True)

    logo = models.ForeignKey(UploadedFile, null=True, blank=True)

    creator = models.ForeignKey(User, editable=False, null=True,
            related_name='created_projects')
    creation_date = models.DateTimeField(auto_now_add=True)
    last_editor = models.ForeignKey(User, editable=False, null=True,
            blank=True, related_name='project_last_editor')
    last_update = models.DateTimeField(auto_now=True)

    def __unicode__(self):
        return unicode(self.name)

    def slug_exists(self, slug):
        return Project.objects.filter(slug=slug).exists()

    def save(self, *a, **kw):
        old_title = Project.objects.get(id=self.id).name if self.id else None
        if not self.id or old_title != self.name:
            self.slug = slugify(self.name,
                    lambda slug: Project.objects.filter(slug=slug).exists())
        return super(Project, self).save(*a, **kw)

    def partners_logo(self):
        """ pseudo-reverse query for retrieving the partners logo"""
        return UploadedFile.get_files_for(self)

    def user_can_edit(self, user):
        return user == self.creator or user in self.contributors.all()

    @property
    def home_url_params(self):
        return dict(project_slug=self.slug)

    @property
    def view_url(self):
        return reverse('project_view', kwargs=self.home_url_params)

    @property
    def edit_url(self):
        return reverse('project_edit', kwargs=self.home_url_params)
    
    @property
    def logo_url(self):
        if self.logo:
            return self.logo.file.url
        else:
            return '/static/img/logo.png'

    @property
    def related_objects(self):
        """Returns a queryset for the objects for a given project"""
        return ProjectRelatedObject.objects.filter(project=self)

    def save_related_object(self, related_object):
        obj, created = ProjectRelatedObject.objects.get_or_create(
                project=self, content_object=related_object)
        return created


if not reversion.is_registered(Project):
    reversion.register(Project)
