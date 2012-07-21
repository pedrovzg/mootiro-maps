#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging
import requests

from django.shortcuts import redirect
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout as auth_logout
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.utils.translation import ugettext as _
from annoying.decorators import render_to, ajax_request

from signatures.models import Signature, DigestSignature
from django_cas.views import _logout_url as cas_logout_url


logger = logging.getLogger(__name__)


#TODO: the function login should process the endpoint /login/cas/
#      And the endpoint /login/ should point to a new page that
#      matches our login design
def login(request):
    '''
    When the user clicks "login" on Mootiro Bar, this view runs.
    It redirects the user to CAS.
    '''
    logger.debug('accessing user_cas > login')
    host_port = request.environ['HTTP_HOST']
    return redirect(settings.CAS_SERVER_URL +
        '?service=http://{}/user/after_login'.format(host_port))


def logout(request):
    logger.debug('accessing user_cas > logout')
    next_page = request.GET.get('next', '/')
    auth_logout(request)
    requests.get(cas_logout_url(request, next_page))
    return redirect(next_page)


@render_to('user_cas/profile.html')
def profile(request, username=''):
    logger.debug('acessing user_cas > profile : {}'.format(username))
    return dict(user=username)


@render_to('user_cas/profile_update.html')
@login_required
def profile_update(request):
    logger.debug('accessing user_cas > profile')
    signatures = Signature.objects.filter(user=request.user)
    digest_obj = DigestSignature.objects.filter(user=request.user)
    digest = digest_obj[0].digest_type if digest_obj.count() \
                  else ''
    return dict(signatures=signatures, digest=digest)


@login_required
@ajax_request
def profile_update_signatures(request):
    logger.debug('accessing user_cas > profile_update')
    logger.debug('POST: {}'.format(request.POST))

    user = request.user
    username = request.POST.get('username', '')
    signatures = request.POST.getlist('signatures')
    digest_type = request.POST.get('digest_type', '')

    success = True
    errors = {}

    # validations
    if not username:
        success = False
        errors['username'] = _('You must provide a username')
    if User.objects.filter(username=username).exclude(pk=user.id).count():
        success = False
        errors['username'] = _('This username already exists')

    if not errors and success:
        # save username
        user.username = username
        user.save()

        # update signatures
        signatures = map(int, signatures) if signatures else []
        for signature in Signature.objects.filter(user=request.user):
            if not signature.id in signatures:
                signature.delete()

        # update digest
        user_digest = DigestSignature.objects.filter(user=request.user)

        if digest_type and not user_digest.count():
            DigestSignature.objects.create(user=request.user,
                    digest_type=digest_type)
        elif user_digest.count() and not digest_type:
            DigestSignature.objects.get(user=request.user).delete()
        elif user_digest.count() and digest_type != user_digest[0].digest_type:
            d = DigestSignature.objects.get(user=request.user)
            d.digest_type = digest_type
            d.save()

        return {'success': 'true', 'redirect': reverse('user_profile')}

    return {'success': 'false', 'errors': errors}

