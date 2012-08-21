#! coding: utf-8 -*-
from __future__ import unicode_literals
import logging

from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from django.db.models.query_utils import Q
from django.http import HttpResponse
from django.utils import simplejson

from lib.taggit.models import TaggedItem
from ajaxforms.forms import ajax_form
from annoying.decorators import render_to, ajax_request
from main.utils import paginated_query, sorted_query, filtered_query

from .forms import FormProject
from .models import Project, ProjectRelatedObject

logger = logging.getLogger(__name__)


@render_to('project/list.html')
def project_list(request):
    logger.debug('acessing komoo_project > list')

    sort_order = ['creation_date', 'votes', 'name']

    community = None
    query_set = Project.objects

    query_set = filtered_query(query_set, request)

    projects_list = sorted_query(query_set, sort_order, request)
    projects_count = projects_list.count()
    projects = paginated_query(projects_list, request)

    return dict(projects=projects, community=community,
                projects_count=projects_count)


@render_to('project/view.html')
def project_view(request, project_slug=''):
    project = get_object_or_404(Project, slug=project_slug)

    proj_objects = {}

    for p in ProjectRelatedObject.objects.filter(project=project):
        obj = p.content_object
        if not proj_objects.get(obj.__class__.__name__, None):
            proj_objects[obj.__class__.__name__] = {
                    'app_name': obj.__module__.split('.')[0],
                    'objects_list': []}
        proj_objects[obj.__class__.__name__]['objects_list'].append({
            'name': obj.name,
            'link': obj.view_url,
            'id': obj.id,
            'has_geojson': bool(getattr(obj, 'geometry', ''))
        })

    return dict(project=project, geojson={}, proj_objects=proj_objects)


@login_required
@ajax_form('project/edit.html', FormProject)
def project_new(request):
    logger.debug('acessing project > project_new')

    def on_get(request, form):
        form.helper.form_action = reverse('project_new')
        return form

    def on_after_save(request, project):
        return {'redirect': project.view_url}

    return {'on_get': on_get, 'on_after_save': on_after_save,
            'project': None}


@login_required
@ajax_form('project/edit.html', FormProject)
def project_edit(request, project_slug='', *arg, **kwargs):
    logger.debug('acessing komoo_project > edit_project')

    project = get_object_or_404(Project, slug=project_slug)

    if not project.user_can_edit(request.user):
        return redirect(project.view_url)

    def on_get(request, form):
        form = FormProject(instance=project)
        kwargs = dict(project_slug=project_slug)
        form.helper.form_action = reverse('project_edit', kwargs=kwargs)

        return form

    def on_after_save(request, obj):
        return {'redirect': obj.view_url}

    return {'on_get': on_get, 'on_after_save': on_after_save,
            'project': project}


@ajax_request
def add_related_object(request):
    logger.debug('acessing project > add_related_object')
    ct = request.POST.get('content_type', '')
    obj_id = request.POST.get('object_id', '')
    proj_id = request.POST.get('project_id', '')
    proj = get_object_or_404(Project, pk=proj_id)

    if proj and obj_id and ct:
        ProjectRelatedObject.objects.get_or_create(content_type_id=ct,
                object_id=obj_id, project_id=proj_id)
        return {'success': True,
                'project': {
                    'id': proj.id,
                    'name': proj.name,
                    'link': proj.view_url
                }}
    else:
        return {'success': False}


@login_required
@ajax_request
def delete_relations(request):
    logger.debug('acessing project > delete_relations : {}'.format(request.POST))
    project = request.POST.get('project', '')
    relations = request.POST.get('associations', '')

    project = get_object_or_404(Project, pk=project)

    if not project.user_can_edit(request.user):
        return redirect(project.view_url)
    try:
        for rel in relations.split('|'):
            if rel:
                p = ProjectRelatedObject.objects.get(pk=rel)
                p.delete()
        success = True
    except Exception as err:
        logger.error('ERRO ao deletar relacao: %s' % err)
        success = False

    return{'success': success}


def tag_search(request):
    logger.debug('acessing project > tag_search')
    term = request.GET['term']
    qset = TaggedItem.tags_for(Project).filter(name__istartswith=term)
    # qset = TaggedItem.tags_for(project)
    tags = [t.name for t in qset]
    return HttpResponse(simplejson.dumps(tags),
                mimetype="application/x-javascript")


def search_by_name(request):
    logger.debug('acessing project > search_by_name')
    term = request.GET['term']
    projects = Project.objects.filter(Q(name__icontains=term) |
                                           Q(slug__icontains=term))
    d = [{'value': p.id, 'label': p.name} for p in projects
            if p.user_can_edit(request.user)]
    return HttpResponse(simplejson.dumps(d),
            mimetype="application/x-javascript")

