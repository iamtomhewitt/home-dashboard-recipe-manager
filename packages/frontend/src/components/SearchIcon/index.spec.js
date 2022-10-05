import React from 'react';
import { render } from '@testing-library/react';

import SearchIcon from '.';

describe('<SearchIcon/>', () => {
  it('should render', () => {
    const { getAllByTestId } = render(<SearchIcon />);
    expect(getAllByTestId('search-icon')).toHaveLength(1);
  });
});
