import React from 'react';
import { render } from '@testing-library/react';

import EditIcon from '.';

describe('<EditIcon/>', () => {
  it('should render', () => {
    const { getAllByTestId } = render(<EditIcon />);
    expect(getAllByTestId('edit-icon')).toHaveLength(1);
  });
});
