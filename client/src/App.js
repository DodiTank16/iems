import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { Fragment, useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import Login from "./components/auth/Login";
import Dashboard from "./components/layout/Dashboard";
import Pedagogy from "./components/Pedagogy/Pedagogy";
import ExamSchedule from "./components/ExamSchedule/ExamSchedule";
import NEList from "./components/NEList/NEList";
import SeatingArrangement from "./components/SeatingArrangement/SeatingArrangement";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap";
import "@fortawesome/fontawesome-free/css/all.css";
import PrivateRoute from "./components/routing/PrivateRoute";
import PrivateAdminRoute from "./components/routing/PrivateAdminRoute";

import { Provider } from "react-redux";
import store from "./store";
import Alert from "./components/layout/Alert";

import setAuthToken from "./utils/setAuthToken";

import { loadUser } from "./actions/auth";
import pDataExport from "./components/Pedagogy/DataExport";
import esDataExport from "./components/ExamSchedule/DataExport";
import neDataExport from "./components/NEList/DataExport";
import { loadAdmin } from "./actions/adminAuth";
import AdminLogin from "./components/auth/AdminLogin";
import AcademicYear from "./components/Admin/AcademicYear";
import Institute from "./components/Admin/Institute";
import Subject from "./components/Admin/Subject";
import User from "./components/Admin/User";
import Resources from "./components/Admin/Resources";

if (localStorage.getItem("token")) {
  setAuthToken(localStorage.getItem("token"));
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
    store.dispatch(loadAdmin());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <section style={{ marginTop: "80px" }} className="container-fluid">
            <Alert />
            <Route exact path="/" render={(_) => <Redirect to="/login" />} />
            <Switch>
              <Route exact path="/login" component={Login} />

              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/pedagogy" component={Pedagogy} />
              <PrivateRoute
                exact
                path="/examSchedule"
                component={ExamSchedule}
              />
              <PrivateRoute exact path="/neList" component={NEList} />
              <PrivateRoute
                exact
                path="/seatingArrangement"
                component={SeatingArrangement}
              />
              {/* Routes for data export... */}
              <PrivateRoute
                exact
                path="/pedagogy/export-data/:expType"
                component={pDataExport}
              />
              <PrivateRoute
                exact
                path="/examSchedule/export-data/:expType"
                component={esDataExport}
              />
              <PrivateRoute
                exact
                path="/neList/export-data/:expType/:componentName"
                component={neDataExport}
              />
              {/* Admin */}
              <Route exact path="/admin/login" component={AdminLogin} />
              <PrivateAdminRoute
                exact
                path="/admin/academicYear"
                component={AcademicYear}
              />
              <PrivateAdminRoute
                exact
                path="/admin/institute"
                component={Institute}
              />
              <PrivateAdminRoute
                exact
                path="/admin/subject"
                component={Subject}
              />
              <PrivateAdminRoute exact path="/admin/user" component={User} />
              <PrivateAdminRoute
                exact
                path="/admin/resources"
                component={Resources}
              />

              {/* Admin */}
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
