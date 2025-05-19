import React from 'react';
import { Link } from 'react-router-dom';

function SideNavbar() {
  return (
    <div className='col-md-3 pb-3 pr-1'>
      <div className='card h-100 shadow'>
        <div className='card-body'>
          <Link className='btn btn-outline-info w-100 mb-3' to='institute'>
            Institute Name
          </Link>
          <Link className='btn btn-outline-info w-100 mb-3' to='subject'>
            Subject
          </Link>
          <Link className='btn btn-outline-info w-100 mb-3' to='academicYear'>
            Academic Year
          </Link>
          <Link className='btn btn-outline-info w-100 mb-3' to='user'>
            User
          </Link>
          <Link className='btn btn-outline-info w-100 mb-3' to='resources'>
            Resources
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SideNavbar;
