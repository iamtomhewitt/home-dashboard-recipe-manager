import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Landing from '.';

describe('<Landing/>', () => {
  const props = {
    getPlanner: jest.fn(),
  };

  it('should render', () => {
    const { getAllByTestId } = render(<Landing {...props} />);
    expect(getAllByTestId('landing')).toHaveLength(1);
  });

  it('should change input', () => {
    const { getByTestId } = render(<Landing {...props} />);
    fireEvent.change(getByTestId('landing-input'), { target: { id: 'input', value: 'new value' } });
    expect(getByTestId('landing-input').value).toEqual('new value');
  });

  it('should get planner', () => {
    const { getByTestId } = render(<Landing {...props} />);
    fireEvent.click(getByTestId('landing-button'));
    expect(props.getPlanner).toHaveBeenCalled();
  });
});
