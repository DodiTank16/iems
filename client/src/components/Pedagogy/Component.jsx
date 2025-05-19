import React from 'react';
import PropTypes from 'prop-types';
import DropDown from '../layout/DropDown';

// Reusable component for each pedagogy containing Name, Mode and weightage of each pedagogy
const Component = ({
  index,
  cName,
  cMode,
  cWeightage = '',
  onNameChanged,
  onModeChanged,
  onWeightageChanged,
}) => {
  return (
    <div className='row'>
      <div className='col'>
        <DropDown
          title={'C' + index + '-Name'}
          options={[
            'Unit Test 1',
            'Unit Test 2',
            'Assignment',
            'Project',
            'Quizes',
            'Research Work',
            'Attendance',
          ].sort()}
          isDisabled={false}
          id={'ddC' + index + '-Name'}
          value={cName}
          onChange={(e) => {
            onNameChanged(e);
          }}
        />
      </div>
      <div className='col'>
        <DropDown
          title={'C' + index + '-Mode'}
          options={['Online', 'Offline'].sort()}
          isDisabled={false}
          id={'ddC' + index + '-Mode'}
          value={cMode}
          onChange={(e) => {
            onModeChanged(e);
          }}
        />
      </div>

      <div className='col'>
        <div className='mb-3 form-group'>
          <label htmlFor={'txt' + index + '-Weightage'} className='form-label'>
            {'C' + index + '-Weightage'}
          </label>
          <input
            className='form-control'
            type='tel'
            id={'txt' + index + '-Weightage'}
            pattern='^(0\d|\d|1\d|2\d|30)$'
            value={cWeightage}
            required
            title='Please enter weightage less than 30.'
            onChange={(e) => {
              onWeightageChanged(e);
            }}
          />
        </div>
      </div>
    </div>
  );
};

Component.propTypes = {
  index: PropTypes.number,
};

export default Component;
