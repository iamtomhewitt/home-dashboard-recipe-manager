import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import Recipes from '.';
import api from '../../lib/api/recipe';

describe('<Recipes/>', () => {
  const props = {
    plannerId: '12345',
  };

  beforeEach(() => {
    api.get = jest.fn().mockResolvedValue([{
      ingredients: [{
        amount: 25,
        category: 'Dairy',
        name: 'Butter',
        weight: 'grams',
      }],
      name: 'Recipe',
      steps: [''],
    }]);
  });

  it('should render', () => {
    const { getAllByTestId } = render(<Recipes {...props} />);
    expect(getAllByTestId('recipes')).toHaveLength(1);
  });

  it('should refresh', async () => {
    const { getByTestId } = render(<Recipes {...props} />);

    await waitFor(() => {
      fireEvent.click(getByTestId('recipes-refresh'));
    });

    expect(api.get).toHaveBeenCalledWith('/recipes?id=12345');
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
      it(`should render a ${type} modal`, async () => {
        const { getByTestId, getAllByTestId, queryAllByTestId } = render(<Recipes {...props} />);

        await waitFor(() => {
          fireEvent.click(getAllByTestId(`recipes-${type}`)[0]);
          expect(getAllByTestId(testId)).toHaveLength(1);
          fireEvent.click(getByTestId('modal-close-button'));
          expect(queryAllByTestId(testId)).toHaveLength(0);
        });
      });
    });
  });
});
