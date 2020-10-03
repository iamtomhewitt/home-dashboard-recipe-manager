package com.iamtomhewitt.homedashboard.recipemanager.service;

import com.iamtomhewitt.homedashboard.recipemanager.exception.RecipeExistsException;
import com.iamtomhewitt.homedashboard.recipemanager.exception.RecipeNotFoundException;
import com.iamtomhewitt.homedashboard.recipemanager.model.Ingredient;
import com.iamtomhewitt.homedashboard.recipemanager.model.Recipe;
import com.iamtomhewitt.homedashboard.recipemanager.repository.RecipeRepository;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;
import java.util.Optional;

import static java.util.Arrays.asList;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@RunWith(SpringRunner.class)
@ActiveProfiles("test")
public class RecipeServiceTests {

	@InjectMocks
	private RecipeService service;

	@Mock
	private RecipeRepository recipeRepository;

	@Rule
	public ExpectedException expectedException = ExpectedException.none();

	private Recipe mockRecipe;

	@Before
	public void eachTest() {
		Ingredient ingredient1 = Ingredient.builder()
			.amount(20)
			.category("Vegetable")
			.name("Tomato")
			.weight("grams")
			.build();

		Ingredient ingredient2 = Ingredient.builder()
			.amount(200)
			.category("Dairy")
			.name("Milk")
			.weight("ml")
			.build();

		mockRecipe = Recipe.builder()
			.name("recipe1")
			.ingredients(asList(ingredient1, ingredient2))
			.steps(asList("Step 1", "Step 2"))
			.build();
	}

	@Test
	public void shouldReturnARecipe() throws Exception {
		when(recipeRepository.findByName(anyString())).thenReturn(Optional.of(mockRecipe));

		Recipe recipe = service.getRecipe("recipe1");

		assertNotNull(recipe);
		verify(recipeRepository, times(1)).findByName("recipe1");
	}

	@Test
	public void shouldThrowExceptionFindingNonExistentRecipe() throws RecipeNotFoundException {
		expectedException.expectMessage("Could not find recipe with name 'recipe1'");

		service.getRecipe("recipe1");

		verify(recipeRepository, times(1)).findByName("recipe1");
	}

	@Test
	public void shouldReturnMultipleRecipes() {
		when(recipeRepository.findAll()).thenReturn(asList(mockRecipe, mockRecipe));

		List<Recipe> recipes = service.getRecipes();

		assertNotNull(recipes);
		assertThat(recipes.size(), is(2));
		verify(recipeRepository, times(1)).findAll();
	}

	@Test
	public void shouldSaveARecipe() throws RecipeExistsException {
		service.saveRecipe(mockRecipe);
		verify(recipeRepository, times(1)).save(mockRecipe);
	}

	@Test
	public void shouldThrowExceptionWhenSavingExistingRecipe() throws RecipeExistsException {
		expectedException.expectMessage("Recipe 'recipe1' already exists");
		when(recipeRepository.findAll()).thenReturn(asList(mockRecipe));
		service.saveRecipe(mockRecipe);
		verify(recipeRepository, times(1)).save(mockRecipe);
	}

	@Test
	public void shouldUpdateRecipe() {
		service.updateRecipe(mockRecipe);
		verify(recipeRepository, times(1)).save(mockRecipe);
	}

	@Test
	public void shouldDeleteRecipe() {
		service.deleteRecipe("recipe1");
		verify(recipeRepository, times(1)).deleteByName("recipe1");
	}
}
