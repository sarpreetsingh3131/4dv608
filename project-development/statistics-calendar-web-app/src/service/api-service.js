export class ApiService {
  constructor () {
    this.apiEndPoint = 'http://localhost:3000/api'
  }

  logIn () {
    return this.callApi('/login', 'GET', null)
  }

  getToken (code) {
    return this.callApi('/token?code=' + code, 'GET', null)
  }

  getUserInfo () {
    return this.callApi('/user/info', 'GET', null)
  }

  getCalendars () {
    return this.callApi('/calendars', 'GET', null)
  }

  getCalendarEvent (calendarId) {
    return this.callApi('/calendars/' + calendarId + '/events', 'GET', null)
  }

  addEventProperties (calendarId, eventId, properties) {
    return this.callApi(
      '/calendars/' + calendarId + '/events/' + eventId + '/properties', 'PATCH', properties
    )
  }

  getTimeSpentStatistics (calendarId, timeMin, timeMax) {
    let query = ''
    if (timeMin != null) {
      query = 'timeMin=' + timeMin
    }
    if (timeMax != null) {
      query += '&timeMax=' + timeMax
    }
    return this.getImage(calendarId, '/time-spent?' + query)
  }

  getUsedRemainingBudgetStatistics (calendarId) {
    return this.getImage(calendarId, '/used-remaining-budget?timeNow=' + new Date().toJSON())
  }

  getImage (calendarId, path) {
    return new Promise((resolve, reject) => {
      window.fetch(this.apiEndPoint + '/calendars/' + calendarId + '/events/statistics' + path, {
        headers: {
          'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }
      })
        .then(res => res.blob())
        .then(blob => resolve(window.URL.createObjectURL(blob)))
        .catch(err => reject(err))
    })
  }

  callApi (url, method, body) {
    return new Promise((resolve, reject) => {
      let config = {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        }
      }

      let token = window.localStorage.getItem('token')

      if (token != null) {
        config.headers.Authorization = 'Bearer ' + token
      }

      if (body != null) {
        config.body = JSON.stringify(body)
      }

      window.fetch(this.apiEndPoint + url, config)
        .then(res => { return this.toJSON(res) })
        .then(data => resolve(data))
        .catch(err => reject(err))
    })
  }

  toJSON (res) {
    return new Promise((resolve, reject) => {
      res.json()
        .then(json => res.ok ? resolve(json) : reject(json))
        .catch(err => reject(err))
    })
  }
}
