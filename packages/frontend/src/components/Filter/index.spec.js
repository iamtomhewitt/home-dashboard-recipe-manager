import React from 'react';
import { render } from '@testing-library/react';

import Filter from '.';

describe('<Filter/>', () => {
  it('should render', () => {
    const { getAllByTestId } = render(<Filter onFilter={jest.fn()} />);
    expect(getAllByTestId('filter')).toHaveLength(1);
  });
});
