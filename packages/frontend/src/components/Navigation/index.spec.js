import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Navigation from '.';
import { planner } from '../../mocks/mocks.json';

describe('<Navigation/>', () => {
  const props = {
    planner,
    changeTab: jest.fn(),
  };

  it('should render', () => {
    const { getAllByTestId } = render(<Navigation {...props} />);
    expect(getAllByTestId('navigation')).toHaveLength(1);
  });

  it('should not render if no planner', () => {
    const { queryAllByTestId } = render(<Navigation />);
    expect(queryAllByTestId('navigation')).toHaveLength(0);
  });

  it('should change tab', () => {
    const { getAllByTestId } = render(<Navigation {...props} />);
    fireEvent.click(getAllByTestId('navigation-tab')[0]);
    fireEvent.click(getAllByTestId('navigation-tab')[1]);
    expect(props.changeTab).toHaveBeenCalledTimes(2);
  });
});
