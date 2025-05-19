import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import React, { Fragment, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadAdmin } from '../../actions/adminAuth';
import setAdminAuthToken from '../../utils/setAdminAuth';
import AdminLogin from '../auth/AdminLogin';
import Alert from '../layout/Alert';
import PrivateAdminRoute from '../routing/PrivateAdminRoute';
import AcademicYear from './AcademicYear';

if (localStorage.getItem('adminToken')) {
  setAdminAuthToken(localStorage.getItem('adminToken'));
}

const Admin = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadAdmin);
  }, []);
  return (
    <Router>
      <Fragment>
        <Alert />
        <section style={{ marginTop: '80px' }} className='container-fluid'>
          <Route
            exact
            path='/'
            render={(_) => <Redirect to='/admin/adminLogin' />}
          />
          <Switch>
            <Route exact path='/admin/adminLogin' component={AdminLogin} />
            <PrivateAdminRoute
              exact
              path='/admin/academicYear'
              component={AcademicYear}
            />
          </Switch>
        </section>
      </Fragment>
    </Router>
  );
};

export default Admin;
