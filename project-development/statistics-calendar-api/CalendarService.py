import json
import os
import requests
import urllib.parse


class CalendarService:

    def __init__(self):
        self.in_memory_tokens = {}

    def get_log_in_url(self):
        query_params = urllib.parse.urlencode({
            'client_id': os.getenv('client_id'),
            'redirect_uri': os.getenv('redirect_uri'),
            'include_granted_scopes': 'true',
            'response_type': 'code',
            'prompt': 'consent',
            'access_type': 'offline',
            'scope': 'https://www.googleapis.com/auth/calendar' + ' ' +
                     'https://www.googleapis.com/auth/calendar.events' + ' ' +
                     'email profile openid'
        })
        return 'https://accounts.google.com/o/oauth2/auth?' + query_params

    def get_token(self, code):
        response, status = self.call_google_api(
            url='https://oauth2.googleapis.com/token',
            method='POST',
            authorization=None,
            data={
                'code': code,
                'client_id': os.getenv('client_id'),
                'client_secret': os.getenv('client_secret'),
                'redirect_uri': os.getenv('redirect_uri'),
                'grant_type': 'authorization_code'
            }
        )

        self.in_memory_tokens['Bearer ' + response['access_token']] = {
            'access_token': 'Bearer ' + response['access_token'],
            'refresh_token': response['refresh_token']
        }

        return response, status

    def log_out(self, authorization):
        self.in_memory_tokens.pop(authorization, None)

    def get_user_info(self, authorization):
        return self.call_google_api(
            url='https://www.googleapis.com/oauth2/v3/userinfo',
            method='GET',
            authorization=authorization,
            data=None
        )

    def get_calendars(self, authorization):
        return self.call_google_api(
            url='https://www.googleapis.com/calendar/v3/users/me/calendarList',
            method='GET',
            authorization=authorization,
            data=None
        )

    def get_calendar_events(self, authorization, calendar_id, time_min=None, time_max=None):
        calendar_id = urllib.parse.quote(calendar_id)
        query_params = ''

        if time_min is not None:
            query_params = urllib.parse.urlencode({'timeMin': time_min})

        if time_max is not None:
            query_params += '&' + urllib.parse.urlencode({'timeMax': time_max})

        return self.call_google_api(
            url='https://www.googleapis.com/calendar/v3/calendars/' + calendar_id + '/events?' + query_params,
            method='GET',
            authorization=authorization,
            data=None
        )

    def add_event_properties(self, authorization, calendar_id, event_id, properties):
        calendar_id = urllib.parse.quote(calendar_id)
        event_id = urllib.parse.quote(event_id)

        return self.call_google_api(
            url='https://www.googleapis.com/calendar/v3/calendars/' + calendar_id + '/events/' + event_id,
            method='PATCH',
            authorization=authorization,
            data={
                'extendedProperties': {
                    'private': properties
                }
            }
        )

    def refresh_token(self, authorization):
        response, status = self.call_google_api(
            url='https://oauth2.googleapis.com/token',
            method='POST',
            authorization=None,
            data={
                'refresh_token': self.in_memory_tokens[authorization]['refresh_token'],
                'client_id': os.getenv('client_id'),
                'client_secret': os.getenv('client_secret'),
                'grant_type': 'refresh_token'
            }
        )

        self.in_memory_tokens[authorization]['access_token'] = 'Bearer ' + response['access_token']

    def call_google_api(self, url, method, authorization, data):
        headers = {
            'content-type': 'application/json',
            'accept': 'application/json'
        }

        if authorization in self.in_memory_tokens:
            headers['authorization'] = self.in_memory_tokens[authorization]['access_token']

        response = {}

        if method == 'GET':
            response = requests.get(url, headers=headers)

        elif method == 'PATCH':
            response = requests.patch(url, data=json.dumps(data), headers=headers)

        elif method == 'POST':
            response = requests.post(url, data=json.dumps(data), headers=headers)

        if response.status_code == 401 and authorization in self.in_memory_tokens:
            self.refresh_token(authorization)
            return self.call_google_api(url, method, authorization, data)

        return response.json(), response.status_code
