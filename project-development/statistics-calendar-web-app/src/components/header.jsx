import React from 'react'
import { ApiService } from '../service/api-service'

export class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      userInfo: {},
      isLoggedIn: false
    }
    this.service = new ApiService()
  }

  componentDidMount () {
    if (window.localStorage.getItem('token') != null && !this.state.isLoggedIn) {
      this.service.getUserInfo()
        .then(res => {
          this.setState({
            userInfo: res,
            isLoggedIn: true
          })
        })
        .catch(err => console.log(err))
    }
  }

  render () {
    return (
      <nav className='navbar navbar-expand-lg navbar-light bg-light'>
        <a className='navbar-brand'
          href='/'>
        Statistics Calendar
        </a>
        <button className='navbar-toggler'
          type='button'
          data-toggle='collapse'
          data-target='#navbarTogglerDemo03'
          aria-controls='navbarTogglerDemo03'
          aria-expanded='false'
          aria-label='Toggle navigation'>
          <span className='navbar-toggler-icon' />
        </button>
        <div className='collapse navbar-collapse'
          id='navbarTogglerDemo03'>
          <ul className='navbar-nav mr-auto mt-2 mt-lg-0' />
          <div className='form-inline my-2 my-lg-0'>
            <a className='navbar-brand'
              href={this.state.userInfo.profile}>
              {this.state.userInfo.name}
            </a>
            {this.state.isLoggedIn
              ? <button className='btn btn-outline-primary my-2 my-sm-0'
                onClick={this.logOut.bind(this)}>
                Log out
              </button>
              : <button className='btn btn-outline-primary my-2 my-sm-0'
                onClick={this.logIn.bind(this)}>
                Log in
              </button>
            }
          </div>
        </div>
      </nav>
    )
  }

  logIn () {
    this.service.logIn()
      .then(res => window.location.replace(res.url))
      .catch(err => console.log(err))
  }

  logOut () {
    window.localStorage.removeItem('token')
    window.location.replace('/')
  }
}
