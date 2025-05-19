import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, deleteUser, getUsers } from '../../actions/user';
import SideNavbar from './SideNavbar';

function User() {
  // To call the actions
  const dispatch = useDispatch();

  //   Get the users from redux state
  const preLoadedUsers = useSelector((state) => state.User.users);

  // Set this component's user state
  const [users, setUsers] = useState([]);

  // To get the value from input field email
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    setUsers(preLoadedUsers);
  }, [preLoadedUsers]);

  return (
    <div className='row py-3'>
      <SideNavbar />
      <div className='col-md-3 pb-3 pr-1'>
        <div className='card h-100 shadow'>
          <div className='card-body'>
            <div className='pb-3'>
              <label className='control-label'>User Name</label>
              <input
                type='text'
                name='instituteName'
                className='form-control mb-2'
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                }}
              ></input>
              <label className='control-label'>User Email</label>
              <input
                type='text'
                name='instituteName'
                className='form-control mb-2'
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                }}
              ></input>
              <button
                className='btn btn-primary'
                onClick={(e) => {
                  dispatch(addUser(formData));
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='col-md-6 pb-3 pr-1'>
        <div className='card h-100 shadow'>
          <div className='card-body'>
            <div className='pb-3'>
              <table className='table table-striped m-2'>
                <thead>
                  <tr>
                    <th className='w-50'>User Name</th>
                    <th>User Email</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users &&
                    users.map((u, id) => {
                      return (
                        <tr key={id}>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td>
                            <span
                              className='fa fa-trash-alt text-danger'
                              onClick={(e) => {
                                dispatch(deleteUser(u._id));
                              }}
                            ></span>
                          </td>
                        </tr>
                      );
                    })}
                  {/* {subjects &&
                  subjects.map((sub, id) => {
                    return (
                      <tr key={id}>
                        <td>{sub.subjectName}</td>
                        <td>
                          <span
                            className="fa fa-trash-alt text-danger"
                            onClick={(e) => {
                              dispatch(deleteSubject(sub._id));
                              dispatch(getSubjects(formData.degreeId));
                            }}
                          ></span>
                        </td>
                      </tr>
                    );
                  })} */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
