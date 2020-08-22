import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/Home'
import NotFound from './components/NotFound'
import './App.css'

export default function App() {
  React.useEffect(() => {
    document.title = 'UpOrDown'
  }, []);

  return (
    <div>
      <Router>
        <Switch>
          <Route exact path='/404'>
            <NotFound />
          </Route>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route path='*'>
            <NotFound />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
