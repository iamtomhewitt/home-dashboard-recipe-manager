import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import App from './App';
import api from './lib/api/recipe';
import { recipes, planner } from './mocks/mocks.json';

describe('<App/>', () => {
  const props = {
    refreshRecipes: jest.fn(),
    recipes,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    jest.spyOn(api, 'get').mockResolvedValue(recipes);
    const { getAllByTestId } = render(<App {...props} />);
    expect(getAllByTestId('app')).toHaveLength(1);
  });

  it('should render a planner', async () => {
    jest.spyOn(api, 'get').mockResolvedValueOnce(planner);
    const { getAllByTestId, getByTestId } = render(<App {...props} />);
    fireEvent.change(getByTestId('landing-input'), { target: { id: 'input', value: 'abc' } });
    fireEvent.click(getByTestId('landing-button'));

    await waitFor(() => {
      expect(getAllByTestId('planner')).toHaveLength(1);
    });
  });

  it('should render recipes', async () => {
    jest.spyOn(api, 'get').mockResolvedValueOnce(planner);
    jest.spyOn(api, 'get').mockResolvedValueOnce(recipes);
    const { getAllByTestId, getByTestId } = render(<App {...props} />);
    fireEvent.change(getByTestId('landing-input'), { target: { id: 'input', value: 'abc' } });
    fireEvent.click(getByTestId('landing-button'));

    await waitFor(() => {
      fireEvent.click(getAllByTestId('navigation-tab')[1]);
      expect(getAllByTestId('recipes')).toHaveLength(1);
    });
  });

  it('should render an error', async () => {
    jest.spyOn(api, 'get').mockResolvedValueOnce({ error: 'test error' });
    const { getAllByTestId, getByTestId } = render(<App {...props} />);
    fireEvent.change(getByTestId('landing-input'), { target: { id: 'input', value: 'abc' } });
    fireEvent.click(getByTestId('landing-button'));

    await waitFor(() => {
      expect(getAllByTestId('app-error')).toHaveLength(1);
    });
  });
});
