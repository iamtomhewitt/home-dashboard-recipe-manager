import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Planner from '.';
import http from '../../lib/http';
import { planner, recipes } from '../../mocks/mocks.json';

describe('<Planner/>', () => {
  const props = {
    planner,
    recipes,
    plannerId: '12345',
  };

  it('should render', () => {
    const { getAllByTestId } = render(<Planner {...props} />);
    expect(getAllByTestId('planner')).toHaveLength(1);
  });

  it('should save when updating planner', () => {
    jest.spyOn(http, 'put').mockResolvedValue({ message: 'test message' });
    const { getAllByTestId } = render(<Planner {...props} />);
    fireEvent.click(getAllByTestId('planner-save-button')[0]);
    expect(http.put).toHaveBeenCalledWith('/planner?id=12345', { day: 'Monday', recipe: 'Food Monday' });
  });
});
