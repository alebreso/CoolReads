import React, { Component } from 'react';
import {Route, withRouter} from 'react-router-dom';
import Nav from './components/Nav';
import ListBook from './components/ListBook';
import CreateBook from './components/CreateBook';
import './App.css';
import Callback from './components/Callback';
import auth from './Auth';
import GuardeRoute from './components/GuardeRoute';

class App extends Component {

  async componentDidMount() {
    if (this.props.location.pathname === '/callback') return
    try{
      await auth.silentAuth()
      this.forceUpdate()
    } catch(err) {
      if(err.error === 'login_required') return
      console.log(err.error)
    }
  }

  render() {
    return (
      <div>
        <Nav />
        <Route exact path='/' component={ListBook} />
        <GuardeRoute exact path='/create' component={CreateBook} />
        <Route exact path='/callback' component={Callback} />
      </div>
    );
  }
}

export default withRouter(App);