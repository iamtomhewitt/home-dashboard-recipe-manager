import React from 'react';
import { render, fireEvent, getByText, findByText } from '@testing-library/react';

import Planner from '.';
import http from '../../lib/http';
import { planner, recipes } from '../../mocks/mocks.json';

describe('<Planner/>', () => {
  const props = {
    planner,
    plannerId: '12345',
  };

  beforeEach(() => {
    http.get = jest.fn().mockResolvedValueOnce([{
      name: 'MOCK Bacon And Leek Risotto',
      ingredients: [],
      steps: [],
    }]);
  });

  it('should render', () => {
    const { getAllByTestId } = render(<Planner {...props} />);
    expect(getAllByTestId('planner')).toHaveLength(1);
  });

  it('should save when updating planner', async () => {
    jest.spyOn(http, 'put').mockResolvedValue({ message: 'test message' });

    const keyDownEvent = { key: 'ArrowDown' };
    const firstRecipe = 'Food Monday';
    const newRecipe = recipes[0].name;

    const selectOption = async (container, optionText) => {
      const placeholder = getByText(container, firstRecipe);
      fireEvent.keyDown(placeholder, keyDownEvent);
      await findByText(container, optionText);
      fireEvent.click(getByText(container, optionText));
    };

    const { getAllByTestId, getByTestId } = render(<Planner {...props} />);
    const firstRecipePlan = getAllByTestId('planner-recipe')[0];
    await selectOption(firstRecipePlan, newRecipe);

    const saveButton = getByTestId('planner-save-button');
    fireEvent.click(saveButton);

    expect(http.put).toHaveBeenCalledWith('/planner?id=12345', { day: 'Monday', recipe: 'MOCK Bacon And Leek Risotto' });
  });
});
