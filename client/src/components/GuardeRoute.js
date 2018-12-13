import React from 'react';
import  { Route } from 'react-router-dom';
import auth from '../Auth';

function GuardeRoute(props) {
  const { component: Component, path} = props
  return (
    <Route exact path={path} render={(props) => {
      if( !auth.isAuthenticated()) return auth.login()
      return <Component {...props} />
    }} />
  )
}

export default GuardeRoute
