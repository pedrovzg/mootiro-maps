# -*- coding: utf-8 -*-
import simplejson

from django.core import mail
from django.core.urlresolvers import reverse

from main.tests import KomooTestCase

from moderation.models import Moderation, Report
from moderation.utils import create_report
from need.models import Need


class ModerationTestCase(KomooTestCase):

    fixtures = KomooTestCase.fixtures + ['needs.json']

    def test_get_for_object_or_create(self):
        need = Need.objects.all()[0]
        moderation = Moderation.objects.get_for_object(need)
        self.assertFalse(moderation)
        moderation = Moderation.objects.get_for_object_or_create(need)
        self.assertTrue(moderation)

    def test_create_report(self):
        user = self.login_user(username='noobzin')
        need = Need.objects.all()[0]
        moderation = Moderation.objects.get_for_object(need)
        self.assertFalse(moderation)

        report = create_report(obj=need, user=user, reason=Report.ANOTHER,
                               comment='Testing')
        moderation = Moderation.objects.get_for_object(need)[0]
        self.assertEqual(moderation.reports.count(), 1)
        self.assertQuerysetEqual(moderation.reports.filter(user=user),
                map(repr, [report]))

        self.assertEqual(len(mail.outbox), 1)

#    def test_can_delete(self):
#        # TODO
#        pass
#
    def test_report_content_box(self):
        self.login_user()
        self.assert_200(reverse('report_content_box'))

    def test_deletion_request_box(self):
        self.login_user()
        self.assert_200(reverse('deletion_request_box'))

    def test_report_view_notloggedin(self):
        need = Need.objects.all()[0]
        response = self.client.post(reverse('moderation_report', args=[],
            kwargs={'app_label': need._meta.app_label,
                    'model_name': need._meta.module_name,
                    'obj_id': need.id}),
            {'reason': Report.SPAM, 'comment': 'Testing'})
        content = simplejson.loads(response.content)
        self.assertEqual(content['success'], 'false')

    def test_report_view_loggedin(self):
        user = self.login_user(username='noobzin')
        need = Need.objects.all()[0]
        moderation = Moderation.objects.get_for_object(need)
        self.assertFalse(moderation)

        response = self.client.post(reverse('moderation_report', args=[],
            kwargs={'app_label': need._meta.app_label,
                    'model_name': need._meta.module_name,
                    'obj_id': need.id}),
            {'reason': Report.SPAM, 'comment': 'Testing'})
        content = simplejson.loads(response.content)
        self.assertEqual(content['success'], 'true')

        moderation = Moderation.objects.get_for_object(need)[0]
        self.assertEqual(moderation.reports.count(), 1)
        report = moderation.reports.filter(user=user)[0]
        self.assertEqual(report.reason, Report.SPAM)
        self.assertEqual(report.comment, 'Testing')

        # Should not create another report if sent twice
        response = self.client.post(reverse('moderation_report', args=[],
            kwargs={'app_label': need._meta.app_label,
                    'model_name': need._meta.module_name,
                    'obj_id': need.id}),
            {'reason': Report.SPAM, 'comment': 'Testing'})
        content = simplejson.loads(response.content)
        self.assertEqual(content['success'], 'true')
        self.assertEqual(moderation.reports.count(), 1)

#    def test_delete_view_notloggedin(self):
#        # TODO
#        pass
#
#    def test_delete_view_loggedin(self):
#        # TODO
#        pass
#