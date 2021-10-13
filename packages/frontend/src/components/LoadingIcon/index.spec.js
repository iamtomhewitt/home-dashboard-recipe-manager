import React from 'react';
import { render } from '@testing-library/react';

import LoadingIcon from '.';

describe('<LoadingIcon/>', () => {
  it('should render', () => {
    const { getAllByTestId } = render(<LoadingIcon />);
    expect(getAllByTestId('loading-icon')).toHaveLength(1);
  });
});
