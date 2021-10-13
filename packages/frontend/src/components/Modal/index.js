import React from 'react';
import PropTypes from 'prop-types';

import CloseIcon from '../CloseIcon';
import './index.scss';

const Modal = ({ children, hideModal }) => (
  <div className='modal' data-test-id='modal'>
    <section className='modal-main'>
      {children}
      <div className='modal-close-button' onClick={hideModal} data-test-id='modal-close-button'>
        <CloseIcon />
      </div>
    </section>
  </div>
);

Modal.propTypes = {
  children: PropTypes.node,
  hideModal: PropTypes.func,
};

export default Modal;
