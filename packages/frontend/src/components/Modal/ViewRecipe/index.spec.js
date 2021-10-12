import React from 'react';
import { render } from '@testing-library/react';

import ViewRecipe from '.';
import { recipes } from '../../../mocks/mocks.json';

describe('<ViewRecipe/>', () => {
  const props = {
    hideModal: jest.fn(),
    recipe: recipes[0],
  };

  it('should render', () => {
    const { getAllByTestId } = render(<ViewRecipe {...props} />);
    expect(getAllByTestId('view-recipe')).toHaveLength(1);
  });
});
