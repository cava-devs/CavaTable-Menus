import React from 'react';
import ReactDOM from 'react-dom';
import Menu from './components/Menu.jsx';
import { BrowserRouter, Route } from 'react-router-dom';

ReactDOM.render((
<BrowserRouter>
  <Route exact path="/restaurant/:restaurantId" component={Menu} />
</BrowserRouter>
), document.getElementById('menusModule'));
