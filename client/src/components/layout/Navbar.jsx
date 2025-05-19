import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { adminLogout } from '../../actions/adminAuth';
import { logout } from '../../actions/auth';

const Navbar = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const location = useLocation();

  // Lists of links to be displayed when logged in
  const authLinks = (
    <Fragment>
      <li className='nav-item'>
        <Link
          className='nav-link btn btn-outline-info mb-3 mb-lg-0 mr-3 px-3'
          to='/dashboard'
        >
          Dashboard
        </Link>
      </li>
      <li className='nav-item'>
        <Link
          className='nav-link btn btn-outline-info mb-3 mb-lg-0 mr-3 px-3'
          to='/pedagogy'
        >
          Pedagogy
        </Link>
      </li>
      <li className='nav-item'>
        <Link
          className='nav-link btn btn-outline-info mb-3 mb-lg-0 mr-3 px-3'
          to='/examSchedule'
        >
          Exam Schedule
        </Link>
      </li>
      <li className='nav-item'>
        <Link
          className='nav-link btn btn-outline-info mb-3 mb-lg-0 mr-3 px-3'
          to='/neList'
        >
          Not-eligibilty List
        </Link>
      </li>
      <li className='nav-item'>
        <Link
          className='nav-link btn btn-outline-info mb-3 mb-lg-0 mr-3 px-3'
          to='/seatingArrangement'
        >
          Seating Arrangement
        </Link>
      </li>
      <li className='nav-item'>
        <a
          className='nav-link btn btn-outline-info mb-3 mb-lg-0 mr-3 px-3'
          href='#!'
          onClick={() => {
            dispatch(logout());
          }}
        >
          Logout
        </a>
      </li>
    </Fragment>
  );

  // Lists of links to be displayed when user is not logged in
  const guestLinks = (
    <li className='nav-item'>
      <Link
        className='nav-link btn btn-outline-info mb-3 mb-lg-0 mr-3 px-3'
        to='/login'
      >
        Login
      </Link>
    </li>
  );

  // Links to be displayed on Dashboard.js
  const dashboardLinks = (
    <li className='nav-item'>
      <a
        className='nav-link btn btn-outline-info mb-3 mb-lg-0 mr-3 px-3'
        href='#!'
        onClick={() => {
          location.pathname.search('admin') !== -1
            ? dispatch(adminLogout())
            : dispatch(logout());
        }}
      >
        Logout
      </a>
    </li>
  );

  // Navbar component that is rendered
  return (
    <nav
      className='navbar navbar-expand-lg fixed-top p-1 shadow-sm '
      style={{ backgroundColor: '#f1f1f1' }}
    >
      <Link className='navbar-brand' to='/'>
        {/* <img
          src='https://www.charusat.ac.in/images/logo.png'
          className='logo img-fluid'
          alt='Logo'
          width='180px'
          height='70px'
        /> */}
        <p className='h1 px-3'>IEMS</p>
      </Link>
      <button
        className='navbar-toggler'
        type='button'
        data-toggle='collapse'
        data-target='#collapsibleNavbar'
      >
        <i className='fas fa-stream text-info border p-2 rounded'></i>
      </button>

      <div
        className='collapse navbar-collapse justify-content-end align-items-center'
        id='collapsibleNavbar'
      >
        <ul className='navbar-nav'>
          {location.pathname === '/dashboard' ||
          location.pathname.search('admin') !== -1
            ? dashboardLinks
            : !loading && (
                <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
              )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
