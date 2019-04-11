import React from 'react'
import { ApiService } from '../service/api-service'

export class Statistics extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      imageSrc: null,
      timeMin: null,
      timeMax: null
    }
    this.timeMin = null
    this.timeMax = null
    this.usedRemaningBudget = 'used-remaining-budget'
    this.timeSpent = 'time-spent'
    this.calendarId = props.match.params.calendarId
    this.url = '/calendars/' + this.calendarId + '/statistics'
    this.statisticsName = props.match.params.statisticsName
    this.service = new ApiService()

    if (this.statisticsName === this.usedRemaningBudget) {
      this.showUsedRemainingBudgetStatistics()
    } else if (this.statisticsName === this.timeSpent) {
      this.showTimeSpentStatistics()
    }
  }

  showUsedRemainingBudgetStatistics () {
    this.service.getUsedRemainingBudgetStatistics(this.calendarId)
      .then(imageSrc => this.setState({ imageSrc: imageSrc }))
      .catch(err => console.log(err))
  }

  showTimeSpentStatistics () {
    let timeMin = null
    let timeMax = null

    if (this.state.timeMin != null) {
      timeMin = this.state.timeMin.toJSON()
    }

    if (this.state.timeMax != null) {
      timeMax = this.state.timeMax.toJSON()
    }

    this.service.getTimeSpentStatistics(this.calendarId, timeMin, timeMax)
      .then(imageSrc => this.setState({ imageSrc: imageSrc }))
      .catch(err => console.log(err))
  }

  handleDateInput (e, key) {
    let timeMin = null
    let timeMax = null

    if (key === 'timeMin') {
      timeMin = new Date(e.target.value)
      let date = new Date()
      date.setDate(timeMin.getDate() + 1)
      document.querySelector('#timeMax').setAttribute('min', date.toJSON().split('T')[0])
    } else if (key === 'timeMax') {
      timeMax = new Date(e.target.value)
    }

    this.setState({
      timeMin: key === 'timeMin' ? timeMin : this.state.timeMin,
      timeMax: key === 'timeMax' ? timeMax : this.state.timeMax
    })
  }

  render () {
    return (
      <div className='card text-center m-3'>
        <div className='card-header'>
          <ul className='nav nav-tabs card-header-tabs'>
            <li className='nav-item'>
              <a className={(this.statisticsName === this.usedRemaningBudget ? 'active' : '') + ' nav-link'}
                href={this.url + '/' + this.usedRemaningBudget}>
                Used & Remaining Budget Statistics
              </a>
            </li>
            <li className='nav-item'>
              <a className={(this.statisticsName === this.timeSpent ? 'active' : '') + ' nav-link'}
                href={this.url + '/' + this.timeSpent}>
                Time Spent Statistics
              </a>
            </li>
          </ul>
        </div>
        <div className='card-body'>
          {this.statisticsName === this.timeSpent
            ? <div className='input-group mb-3'>
              <div className='input-group-prepend'>
                <label className='input-group-text'>
                  From
                </label>
              </div>
              <input type='date'
                className='form-control'
                onChange={e => this.handleDateInput(e, 'timeMin')}
              />
              <div className='input-group-prepend'>
                <label className='input-group-text'>
                  To
                </label>
              </div>
              <input type='date'
                className='form-control'
                id='timeMax'
                onChange={e => this.handleDateInput(e, 'timeMax')}
              />
              <div className='input-group-append'>
                <button className='btn btn-outline-secondary'
                  type='button'
                  onClick={this.showTimeSpentStatistics.bind(this)}>
                  Show
                </button>
              </div>
            </div>
            : null
          }

          {this.state.imageSrc === null
            ? <div className='spinner-border text-primary'
              role='status' />
            : <img src={this.state.imageSrc} alt='' />
          }
        </div>
      </div>
    )
  }
}
