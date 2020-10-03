package com.iamtomhewitt.homedashboard.recipemanager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iamtomhewitt.homedashboard.recipemanager.exception.RecipeExistsException;
import com.iamtomhewitt.homedashboard.recipemanager.exception.RecipeNotFoundException;
import com.iamtomhewitt.homedashboard.recipemanager.model.Recipe;
import com.iamtomhewitt.homedashboard.recipemanager.service.RecipeService;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Arrays;
import java.util.List;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = RecipeController.class)
@ActiveProfiles("test")
public class RecipeControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private RecipeService service;

	@Autowired
	private ObjectMapper objectMapper;

	@Rule
	public ExpectedException expectedException = ExpectedException.none();

	private Recipe mockRecipe;
	private List<Recipe> mockRecipes;

	@Before
	public void eachTest() {
		mockRecipe = Recipe.builder()
			.name("recipe")
			.ingredients(null)
			.steps(Arrays.asList("Step 1", "Step 2"))
			.build();

		mockRecipes = Arrays.asList(mockRecipe, Recipe.builder()
			.name("recipe2")
			.ingredients(null)
			.steps(Arrays.asList("Step 1", "Step 2"))
			.build());
	}

	@Test
	public void shouldGetSingleRecipe() throws Exception {
		when(service.getRecipe(anyString())).thenReturn(mockRecipe);

		MvcResult result = mockMvc.perform(get("/recipes?name=recipe"))
			.andExpect(status().isOk())
			.andReturn();

		Recipe r = objectMapper.readValue(result.getResponse().getContentAsString(), Recipe.class);

		verify(service, times(1)).getRecipe("recipe");
		assertThat(r.getName(), is("recipe"));
	}

	@Test
	public void shouldThrowExceptionWhenTryingToFindARecipeThatDoesNotExist() throws RecipeNotFoundException {
		when(service.getRecipe(anyString())).thenThrow(new RecipeNotFoundException("recipe"));

		try {
			mockMvc.perform(get("/recipes?name=recipe"));
		} catch (Exception e) {
			assertThat(e.getCause().getClass(), is(RecipeNotFoundException.class));
			assertThat(e.getCause().getMessage(), is("Could not find recipe with name 'recipe'"));
		}

		verify(service, times(1)).getRecipe("recipe");
	}

	@Test
	public void shouldGetRecipes() throws Exception {
		when(service.getRecipes()).thenReturn(mockRecipes);

		MvcResult result = mockMvc.perform(get("/recipes"))
			.andExpect(status().isOk())
			.andReturn();

		Recipe[] recipes = objectMapper.readValue(result.getResponse().getContentAsString(), Recipe[].class);

		verify(service, times(1)).getRecipes();
		assertThat(recipes.length, is(2));
	}

	@Test
	public void shouldSaveRecipe() throws Exception {
		mockMvc.perform(post("/recipes")
			.content(objectMapper.writeValueAsString(mockRecipe))
			.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andReturn();

		verify(service, times(1)).saveRecipe(any());
	}

	@Test
	public void shouldThrowExceptionIfSavingAPreExistingRecipe() throws Exception {
		doThrow(new RecipeExistsException("recipe")).when(service).saveRecipe(any());

		try {
			mockMvc.perform(post("/recipes")
				.content(objectMapper.writeValueAsString(mockRecipe))
				.contentType(MediaType.APPLICATION_JSON))
				.andReturn();
		} catch (Exception e) {
			assertThat(e.getCause().getClass(), is(RecipeExistsException.class));
			assertThat(e.getCause().getMessage(), is("Recipe 'recipe' already exists"));
		}

		verify(service, times(1)).saveRecipe(any());
	}

	@Test
	public void shouldUpdateRecipe() throws Exception {
		mockMvc.perform(put("/recipes")
			.content(objectMapper.writeValueAsString(mockRecipe))
			.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andReturn();

		verify(service, times(1)).updateRecipe(any());
	}

	@Test
	public void shouldDeleteRecipe() throws Exception {
		mockMvc.perform(delete("/recipes?name=recipe"))
			.andExpect(status().isOk())
			.andReturn();

		verify(service, times(1)).deleteRecipe(anyString());
	}
}
