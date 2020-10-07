package com.iamtomhewitt.homedashboard.recipemanager.service;

import com.iamtomhewitt.homedashboard.recipemanager.exception.PlannerNotFoundException;
import com.iamtomhewitt.homedashboard.recipemanager.model.Ingredient;
import com.iamtomhewitt.homedashboard.recipemanager.model.Plan;
import com.iamtomhewitt.homedashboard.recipemanager.model.Planner;
import com.iamtomhewitt.homedashboard.recipemanager.model.Recipe;
import com.iamtomhewitt.homedashboard.recipemanager.repository.PlannerRepository;
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
import static org.junit.Assert.assertThat;
import static org.junit.Assert.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@RunWith(SpringRunner.class)
@ActiveProfiles("test")
public class ShoppingListServiceTests {

	@InjectMocks
	private ShoppingListService shoppingListService;

	@Mock
	private RecipeRepository recipeRepository;

	@Mock
	private PlannerRepository plannerRepository;

	@Rule
	public ExpectedException expectedException = ExpectedException.none();

	private Recipe mockRecipe1;
	private Recipe mockRecipe2;
	private Planner mockPlanner;
	private String plannerId = "id";

	@Before
	public void eachTest() {
		Ingredient ingredient1 = Ingredient.builder()
			.amount(20)
			.category("Vegetable")
			.name("Tomato")
			.weight("grams")
			.build();

		Ingredient ingredient2 = Ingredient.builder()
			.amount(5)
			.category("Vegetable")
			.name("Tomato")
			.weight("quantity")
			.build();

		Ingredient ingredient3 = Ingredient.builder()
			.amount(200)
			.category("Frozen")
			.name("Chips")
			.weight("grams")
			.build();

		Ingredient ingredient4 = Ingredient.builder()
			.amount(2)
			.category("Vegetable")
			.name("Leeks")
			.weight("quantity")
			.build();

		mockRecipe1 = Recipe.builder()
			.name("recipe1")
			.ingredients(asList(ingredient1, ingredient2))
			.steps(asList("Step 1", "Step 2"))
			.build();

		mockRecipe2 = Recipe.builder()
			.name("recipe2")
			.ingredients(asList(ingredient1, ingredient3, ingredient4))
			.steps(asList("Step 1", "Step 2"))
			.build();

		mockPlanner = Planner.builder()
			.plannerId("id")
			.plan(asList(
				Plan.builder()
					.day("Monday")
					.recipe("recipe1")
					.build(),
				Plan.builder()
					.day("Tuesday")
					.recipe("recipe2")
					.build()))
			.build();
	}

	@Test
	public void shouldReturnAShoppingList() throws Exception {
		when(recipeRepository.findByName("recipe1")).thenReturn(Optional.of(mockRecipe1));
		when(recipeRepository.findByName("recipe2")).thenReturn(Optional.of(mockRecipe2));
		when(plannerRepository.findByPlannerId(anyString())).thenReturn(Optional.of(mockPlanner));

		List<String> shoppingList = shoppingListService.getShoppingList(plannerId);

		assertThat(shoppingList.isEmpty(), is(false));
		assertThat(shoppingList.size(), is(4));
		assertTrue(shoppingList.contains("40g of Tomato"));
		assertTrue(shoppingList.contains("200g of Chips"));
		assertTrue(shoppingList.contains("5 Tomato(s)"));
		assertTrue(shoppingList.contains("2 Leek(s)"));
	}

	@Test
	public void shouldReturnAShoppingListWhenOneRecipeIsEmpty() throws Exception {
		when(recipeRepository.findByName("recipe1")).thenReturn(Optional.empty());
		when(recipeRepository.findByName("recipe2")).thenReturn(Optional.of(mockRecipe2));
		when(plannerRepository.findByPlannerId(anyString())).thenReturn(Optional.of(mockPlanner));

		List<String> shoppingList = shoppingListService.getShoppingList(plannerId);

		assertThat(shoppingList.isEmpty(), is(false));
		assertThat(shoppingList.size(), is(3));
	}

	@Test
	public void shouldThrowExceptionWhenTryingToGetShoppingListForNonExistentPlanner() throws Exception {
		expectedException.expect(PlannerNotFoundException.class);
		expectedException.expectMessage("Could not find planner with id 'id'");
		when(shoppingListService.getShoppingList(plannerId)).thenThrow(new PlannerNotFoundException(plannerId));

		shoppingListService.getShoppingList(plannerId);

		verify(shoppingListService, times(1)).getShoppingList(anyString());
	}
}
