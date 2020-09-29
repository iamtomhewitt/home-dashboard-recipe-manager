package com.iamtomhewitt.homedashboard.recipemanager.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.iamtomhewitt.homedashboard.recipemanager.exception.PlannerExistsException;
import com.iamtomhewitt.homedashboard.recipemanager.exception.PlannerNotFoundException;
import com.iamtomhewitt.homedashboard.recipemanager.model.Plan;
import com.iamtomhewitt.homedashboard.recipemanager.model.Planner;
import com.iamtomhewitt.homedashboard.recipemanager.service.PlannerService;
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

import java.util.Collections;

import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = PlannerController.class)
@ActiveProfiles("test")
public class PlannerControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private PlannerService service;

	@Autowired
	private ObjectMapper objectMapper;

	@Rule
	public ExpectedException expectedException = ExpectedException.none();

	private Planner mockPlanner;

	@Before
	public void eachTest() {
		mockPlanner = Planner.builder()
			.id("id")
			.plan(Collections.singletonList(
				Plan.builder()
					.day("Monday")
					.recipe("recipe")
					.build()))
			.build();
	}

	@Test
	public void shouldGetPlanner() throws Exception {
		when(service.getPlanner(anyString())).thenReturn(mockPlanner);

		MvcResult result = mockMvc.perform(get("/planner?id=id"))
			.andExpect(status().isOk())
			.andReturn();

		Planner planner = objectMapper.readValue(result.getResponse().getContentAsString(), Planner.class);

		verify(service, times(1)).getPlanner("id");
		assertThat(planner.getId(), is("id"));
		assertThat(planner.getPlan().isEmpty(), is(false));
	}

	@Test
	public void shouldThrowExceptionWhenTryingToFindAPlannerThatDoesNotExist() throws PlannerNotFoundException {
		when(service.getPlanner(anyString())).thenThrow(new PlannerNotFoundException("id"));

		try {
			mockMvc.perform(get("/planner?id=id"));
		} catch (Exception e) {
			assertThat(e.getCause().getClass(), is(PlannerNotFoundException.class));
			assertThat(e.getCause().getMessage(), is("Could not find planner with id 'id'"));
		}

		verify(service, times(1)).getPlanner(anyString());
	}

	@Test
	public void shouldSavePlanner() throws Exception {
		mockMvc.perform(post("/planner")
			.content(objectMapper.writeValueAsString(mockPlanner))
			.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andReturn();

		verify(service, times(1)).savePlanner(any());
	}

	@Test
	public void shouldThrowExceptionIfSavingAPreExistingPlanner() throws Exception {
		doThrow(new PlannerExistsException("id")).when(service).savePlanner(any());

		try {
			mockMvc.perform(post("/planner")
				.content(objectMapper.writeValueAsString(mockPlanner))
				.contentType(MediaType.APPLICATION_JSON))
				.andReturn();
		} catch (Exception e) {
			assertThat(e.getCause().getClass(), is(PlannerExistsException.class));
			assertThat(e.getCause().getMessage(), is("Planner with id 'id' already exists"));
		}

		verify(service, times(1)).savePlanner(any());
	}

	@Test
	public void shouldUpdatePlanner() throws Exception {
		Plan plan = mockPlanner.getPlan().get(0);
		mockMvc.perform(put("/planner?id=id")
			.content(objectMapper.writeValueAsString(plan))
			.contentType(MediaType.APPLICATION_JSON))
			.andExpect(status().isOk())
			.andReturn();

		verify(service, times(1)).updatePlanner(plan, "id");
	}
}
