import React from 'react';
import PropTypes from 'prop-types';
import { version } from '../../../package.json';

import './index.scss';

class Landing extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      input: 'a914912016714dafb44e8e5456997161', // TODO remove
    };
  }

  onInputChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  render() {
    const { isLoading, input } = this.state;
    const { getPlanner } = this.props;

    return (
      <div className='landing' data-test-id='landing'>
        <h1>Home Dashboard Recipe Manager</h1>
        <div className='landing-version'>v{version}</div>

        <div className='landing-login'>
          <div className='landing-login-input'>
            <span>Planner ID</span>
            <input value={input} id='input' onChange={this.onInputChange} data-test-id='landing-input' />
          </div>
          <button disabled={isLoading || input === ''} onClick={() => getPlanner(input)} data-test-id='landing-button'>
            Get Planner
          </button>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  getPlanner: PropTypes.func.isRequired,
};

export default Landing;
