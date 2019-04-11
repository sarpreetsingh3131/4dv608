import React from 'react'
import { ApiService } from '../service/api-service'

export class Calendar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      calendars: {
        items: []
      }
    }
    this.service = new ApiService()

    this.service.getCalendars()
      .then(res => this.setState({ calendars: res }))
      .catch(err => console.log(err))
  }

  goToStatisticsPage (calendarId) {
    window.location.replace(
      '/calendars/' + encodeURIComponent(calendarId) + '/statistics/used-remaining-budget'
    )
  }

  render () {
    return (
      <div className='row m-2'>
        {this.state.calendars.items.map((item, index) =>
          <div key={index}
            className='col-sm-4 p-3'>
            <div className='card text-center'>
              <div className='card-header'>
                {item.summary}
              </div>
              <div className='card-body'>
                <p className='card-text'>
                  Access role: {item.accessRole}
                </p>
                <p className='card-text'>
                  Time zone: {item.timeZone}
                </p>
                <a href={'/calendars/' + encodeURIComponent(item.id) + '/events'}
                  className='btn btn-outline-primary'>
                  Events
                </a>

                <button onClick={this.goToStatisticsPage.bind(this, item.id)}
                  className='btn btn-outline-primary ml-2'
                  disabled={!(item.accessRole === 'owner' || item.accessRole === 'writer')}>
                  Statistics
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}
