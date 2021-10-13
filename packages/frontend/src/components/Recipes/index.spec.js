import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Recipes from '.';
import { recipes } from '../../mocks/mocks.json';

describe('<Recipes/>', () => {
  const props = {
    refreshRecipes: jest.fn(),
    recipes,
  };

  it('should render', () => {
    const { getAllByTestId } = render(<Recipes {...props} />);
    expect(getAllByTestId('recipes')).toHaveLength(1);
  });

  it('should refresh', () => {
    const { getByTestId } = render(<Recipes {...props} />);
    fireEvent.click(getByTestId('recipes-refresh'));
    expect(props.refreshRecipes).toHaveBeenCalled();
  });

  describe('when clicking each of the buttons', () => {
    const data = [{
      type: 'view',
      testId: 'view-recipe',
    }, {
      type: 'edit',
      testId: 'recipe-editor',
    }, {
      type: 'delete',
      testId: 'delete-recipe',
    }, {
      type: 'add',
      testId: 'recipe-editor',
    }];

    data.forEach(({ type, testId }) => {
      it(`should render a ${type} modal`, () => {
        const { getByTestId, getAllByTestId, queryAllByTestId } = render(<Recipes {...props} />);
        fireEvent.click(getAllByTestId(`recipes-${type}`)[0]);
        expect(getAllByTestId(testId)).toHaveLength(1);
        fireEvent.click(getByTestId('modal-close-button'));
        expect(queryAllByTestId(testId)).toHaveLength(0);
      });
    });
  });
});
