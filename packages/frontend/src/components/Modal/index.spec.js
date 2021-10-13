import React from 'react';
import { render } from '@testing-library/react';

import Modal from '.';

describe('<Modal/>', () => {
  const props = {
    hideModal: jest.fn(),
    children: <div />,
  };

  it('should render', () => {
    const { getAllByTestId } = render(<Modal {...props} />);
    expect(getAllByTestId('modal')).toHaveLength(1);
  });
});
