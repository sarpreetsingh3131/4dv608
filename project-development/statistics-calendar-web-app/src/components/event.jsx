import React from 'react'
import { ApiService } from '../service/api-service'

export class Event extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      events: {
        items: []
      },
      popUp: {
        id: '',
        index: 0,
        title: '',
        keyword: '',
        budget: ''
      }
    }
    this.service = new ApiService()

    this.service.getCalendarEvent(this.props.match.params.calendarId)
      .then(res => this.setState({ events: res }))
      .catch(err => console.log(err))
  }

  getValue (item, key) {
    try {
      let value = item['extendedProperties']['private'][key]
      return value === undefined ? '' : value
    } catch (e) {
      return ''
    }
  }

  handleInput (e, key) {
    let value = e.target.value
    this.setState({
      popUp: {
        id: this.state.popUp.id,
        index: this.state.popUp.index,
        keyword: key === 'keyword' ? value : this.state.popUp.keyword,
        budget: key === 'budget' ? value : this.state.popUp.budget
      }
    })
  }

  openPopUp (item, index) {
    this.setState({
      popUp: {
        id: item.id,
        index: index,
        title: item.summary,
        keyword: this.getValue(item, 'keyword'),
        budget: this.getValue(item, 'budget')
      }
    })
  }

  closePopUp () {
    this.setState({
      popUp: {
        id: '',
        index: 0,
        title: '',
        keyword: '',
        budget: ''
      }
    })
  }

  addEventProperties () {
    this.service.addEventProperties(this.props.match.params.calendarId, encodeURIComponent(this.state.popUp.id), {
      keyword: this.state.popUp.keyword,
      budget: this.state.popUp.budget
    })
      .then(event => {
        let events = this.state.events
        events.items[this.state.popUp.index] = event
        this.setState({
          events: events,
          popUp: {
            id: '',
            index: 0,
            title: '',
            keyword: '',
            budget: ''
          }
        })
      })
      .catch(err => console.log(err))
  }

  render () {
    return (
      <div className='row m-2'>
        {this.state.events.items.map((item, index) =>
          <div key={index}
            className='col-sm-4 p-3'>
            <div className='card text-center'>
              <div className='card-header'>
                {item.summary}
              </div>
              <div className='card-body'>
                <p className='card-text'>
                  Access role: {this.state.events.accessRole}
                </p>
                <p className='card-text'>
                  Time zone: {this.state.events.timeZone}
                </p>
                <p className='card-text'>
                  Start: {
                    new Date(item.start.dateTime || item.start.date).toDateString() + ' at ' +
                    new Date(item.start.dateTime || item.start.date).toLocaleTimeString()
                  }
                </p>
                <p className='card-text'>
                  End: {
                    new Date(item.end.dateTime || item.end.date).toDateString() + ' at ' +
                    new Date(item.end.dateTime || item.end.date).toLocaleTimeString()
                  }
                </p>
                {
                  (this.state.events.accessRole === 'owner' || this.state.events.accessRole === 'writer')
                    ? <div>
                      <hr />
                      <p className='card-text'>
                        Keyword: {this.getValue(item, 'keyword')}
                      </p>
                      <p className='card-text'>
                        Budget: {this.getValue(item, 'budget')}
                      </p>
                      <button type='button'
                        className='btn btn-outline-primary'
                        data-toggle='modal'
                        data-target='#exampleModalCenter'
                        onClick={() => this.openPopUp(item, index)}>
                        Edit
                      </button>
                    </div>
                    : null
                }
              </div>
            </div>
          </div>
        )}
        <div className='modal fade'
          id='exampleModalCenter'
          tabIndex='-1'
          role='dialog'
          aria-labelledby='exampleModalCenterTitle'
          aria-hidden='true'>
          <div className='modal-dialog'
            role='document'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'
                  id='exampleModalCenterTitle'>
                  {this.state.popUp.title}
                </h5>
                <button type='button'
                  className='close'
                  data-dismiss='modal'
                  aria-label='Close'>
                  <span aria-hidden='true'>
                    &times;
                  </span>
                </button>
              </div>
              <div className='modal-body'>
                <div className='input-group mb-3'>
                  <div className='input-group-prepend'>
                    <span className='input-group-text'
                      id='basic-addon1'>
                      Keyword
                    </span>
                  </div>
                  <input type='text'
                    className='form-control'
                    aria-describedby='basic-addon1'
                    value={this.state.popUp.keyword}
                    onChange={e => this.handleInput(e, 'keyword')}
                  />
                </div>
                <div className='input-group mb-3'>
                  <div className='input-group-prepend'>
                    <span className='input-group-text'
                      id='basic-addon2'>
                      Budget
                    </span>
                  </div>
                  <input type='number'
                    className='form-control'
                    aria-describedby='basic-addon2'
                    value={this.state.popUp.budget}
                    onChange={e => this.handleInput(e, 'budget')}
                  />
                </div>
              </div>
              <div className='modal-footer'>
                <button type='button'
                  className='btn btn-secondary'
                  data-dismiss='modal'
                  onClick={this.closePopUp.bind(this)}>
                  Close
                </button>
                <button type='button'
                  className='btn btn-primary'
                  data-dismiss='modal'
                  onClick={this.addEventProperties.bind(this)}>
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
