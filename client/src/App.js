import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import { Fragment } from 'react';
import login from './components/Login';
import Pedagogy from './components/Pedagogy';

function App() {
 return <Router>
 <Fragment>
<Switch>
   <Route exact path="/" component={login} />
   <Route exact path="/pedagogy" component={Pedagogy} />
</Switch>
 </Fragment>
</Router>
}

export default App;
