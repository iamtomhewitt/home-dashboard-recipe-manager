import React from 'react';
import { render } from '@testing-library/react';

import CloseIcon from '.';

describe('<CloseIcon/>', () => {
  it('should render', () => {
    const { getAllByTestId } = render(<CloseIcon />);
    expect(getAllByTestId('close-icon')).toHaveLength(1);
  });
});
