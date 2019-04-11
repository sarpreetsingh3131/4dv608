import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Header } from './components/header'
import { Calendar } from './components/calendar'
import { ApiService } from './service/api-service'
import { Event } from './components/event'
import { Statistics } from './components/statistics'

export const HOST = 'http://localhost:4000'

export default class App extends React.Component {
  constructor (props) {
    super(props)
    this.service = new ApiService()

    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.get('code') != null) {
      this.service.getToken(searchParams.get('code'))
        .then(res => {
          window.localStorage.setItem('token', res.access_token)
          window.location.replace('/calendars')
        })
        .catch(err => console.log(err))
    }

    let accessToken = window.localStorage.getItem('token')
    if (accessToken != null && window.location.pathname === '/') {
      window.location.replace('/calendars')
    }
  }

  render () {
    return (
      <div>
        <Header />
        <Router>
          <Switch>
            <Route exact path={'/calendars'} component={Calendar} />
            <Route exact path={'/calendars/:calendarId/events'} component={Event} />
            <Route exact path={'/calendars/:calendarId/statistics/:statisticsName'} component={Statistics} />
          </Switch>
        </Router>
      </div>
    )
  }
}
