package com.iamtomhewitt.homedashboard.recipemanager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iamtomhewitt.homedashboard.recipemanager.exception.PlannerExistsException;
import com.iamtomhewitt.homedashboard.recipemanager.exception.PlannerNotFoundException;
import com.iamtomhewitt.homedashboard.recipemanager.model.Plan;
import com.iamtomhewitt.homedashboard.recipemanager.model.Planner;
import com.iamtomhewitt.homedashboard.recipemanager.model.Planner;
import com.iamtomhewitt.homedashboard.recipemanager.service.PlannerService;
import com.iamtomhewitt.homedashboard.recipemanager.service.ShoppingListService;
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
import java.util.Collections;
import java.util.List;

import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;
import static org.hamcrest.Matchers.is;
import static org.hamcrest.Matchers.not;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = ShoppingListController.class)
@ActiveProfiles("test")
public class ShoppingListControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private ShoppingListService service;

	@Autowired
	private ObjectMapper objectMapper;

	@Rule
	public ExpectedException expectedException = ExpectedException.none();

	private List<String> mockPlanner;

	@Before
	public void eachTest() {
		mockPlanner = asList("A", "B");
	}

	@Test
	public void shouldGetShoppingList() throws Exception {
		when(service.getShoppingList(anyString())).thenReturn(mockPlanner);

		MvcResult result = mockMvc.perform(get("/shoppingList?id=id"))
			.andExpect(status().isOk())
			.andReturn();

		String[] list = objectMapper.readValue(result.getResponse().getContentAsString(), String[].class);

		verify(service, times(1)).getShoppingList("id");
		assertThat(list.length, not(0));
	}
}