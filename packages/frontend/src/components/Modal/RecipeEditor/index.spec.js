import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import RecipeEditor from '.';
import http from '../../../lib/http';
import { recipes } from '../../../mocks/mocks.json';

describe('<RecipeEditor/>', () => {
  const props = {
    isEditing: false,
    recipe: recipes[0],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('when adding a new recipe', () => {
    beforeEach(() => {
      props.isEditing = false;
    });

    it('should render when adding a new recipe', () => {
      const { getAllByTestId } = render(<RecipeEditor {...props} />);
      expect(getAllByTestId('recipe-editor')).toHaveLength(1);
    });

    it('should change aspects of the recipe', () => {
      const { getByTestId, getAllByTestId } = render(<RecipeEditor {...props} />);
      const originalIngredientsSize = props.recipe.ingredients.length;
      const originalStepsSize = props.recipe.steps.length;

      // Add new stuff
      fireEvent.change(getByTestId('recipe-editor-name-input'), { target: { value: 'new name' } });
      fireEvent.click(getByTestId('recipe-editor-add-ingredient-button'));
      fireEvent.click(getByTestId('recipe-editor-add-step-button'));
      expect(getByTestId('recipe-editor-name-input').value).toEqual('new name');
      expect(getAllByTestId('ingredient')).toHaveLength(originalIngredientsSize + 1);
      expect(getAllByTestId('step')).toHaveLength(originalStepsSize + 1);

      // Change existing stuff
      fireEvent.change(getAllByTestId('ingredient-input-name')[0], { target: { value: 'new ingredient name', id: 'name' } }, 0);
      fireEvent.change(getAllByTestId('step-input')[0], { target: { value: 'new step', id: 0 } });
      expect(getAllByTestId('ingredient-input-name')[0].value).toEqual('new ingredient name');
      expect(getAllByTestId('step-input')[0].value).toEqual('new step');

      // Remove existing stuff
      fireEvent.click(getAllByTestId('ingredient-remove-button')[0]);
      fireEvent.click(getAllByTestId('step-remove-button')[0]);
      expect(getAllByTestId('ingredient')).toHaveLength(originalIngredientsSize); // We've already added one so removing makes back to original size
      expect(getAllByTestId('step')).toHaveLength(originalStepsSize); // We've already added one so removing makes back to original size
    });

    it('should make correct request', () => {
      jest.spyOn(http, 'post').mockResolvedValue({ message: 'Done!' });
      jest.spyOn(http, 'put').mockResolvedValue({ message: 'Done!' });
      const { getByTestId } = render(<RecipeEditor {...props} />);
      fireEvent.click(getByTestId('recipe-editor-submit-button'));
      expect(http.post).toHaveBeenCalled();
      expect(http.put).not.toHaveBeenCalled();
    });
  });

  describe('when editing a recipe', () => {
    beforeEach(() => {
      props.isEditing = true;
    });

    it('should make correct request editing', () => {
      jest.spyOn(http, 'post').mockResolvedValue({ message: 'Done!' });
      jest.spyOn(http, 'put').mockResolvedValue({ message: 'Done!' });
      const { getByTestId } = render(<RecipeEditor {...props} />);
      fireEvent.click(getByTestId('recipe-editor-submit-button'));
      expect(http.put).toHaveBeenCalled();
      expect(http.post).not.toHaveBeenCalled();
    });
  });
});
