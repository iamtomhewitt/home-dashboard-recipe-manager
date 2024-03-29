import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import DeleteRecipe from '.';
import api from '../../../lib/api/recipe';

describe('<DeleteRecipe/>', () => {
  const props = {
    hideModal: jest.fn(),
    recipe: {
      name: 'a recipe',
      ingredients: [],
      steps: [],
    },
    plannerId: '12345',
  };

  it('should render', () => {
    const { getAllByTestId } = render(<DeleteRecipe {...props} />);
    expect(getAllByTestId('delete-recipe')).toHaveLength(1);
  });

  it('should delete a recipe', () => {
    jest.spyOn(api, 'delete').mockResolvedValue({ message: 'test message' });

    const { getByTestId } = render(<DeleteRecipe {...props} />);
    fireEvent.click(getByTestId('delete-recipe-yes'));
    expect(api.delete).toHaveBeenCalledWith('/recipes?name=a recipe&id=12345');
  });
});
