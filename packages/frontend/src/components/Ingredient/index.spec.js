import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Ingredient from '.';

describe('<Ingredient/>', () => {
  const props = {
    index: 0,
    ingredient: {
      name: 'test',
      amount: 1,
      weight: 'grams',
      category: 'Dairy',
    },
    onChange: jest.fn(),
    onRemove: jest.fn(),
  };

  it('should render', () => {
    const { getAllByTestId } = render(<Ingredient {...props} />);
    expect(getAllByTestId('ingredient')).toHaveLength(1);
  });

  it('should remove ingredient', () => {
    const { getByTestId } = render(<Ingredient {...props} />);
    fireEvent.click(getByTestId('ingredient-remove-button'));
    expect(props.onRemove).toHaveBeenCalled();
  });

  it('should change ingredient', () => {
    const inputEvent = { target: { value: 'new' } };
    const { getByTestId } = render(<Ingredient {...props} />);
    fireEvent.change(getByTestId('ingredient-input-name'), inputEvent);
    fireEvent.change(getByTestId('ingredient-input-amount'), inputEvent);
    expect(props.onChange).toHaveBeenCalledTimes(2);
  });
});
