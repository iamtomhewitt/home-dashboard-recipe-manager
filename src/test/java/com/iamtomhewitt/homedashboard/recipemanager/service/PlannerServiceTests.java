package com.iamtomhewitt.homedashboard.recipemanager.service;

import com.iamtomhewitt.homedashboard.recipemanager.exception.InvalidDayException;
import com.iamtomhewitt.homedashboard.recipemanager.exception.PlannerExistsException;
import com.iamtomhewitt.homedashboard.recipemanager.exception.PlannerNotFoundException;
import com.iamtomhewitt.homedashboard.recipemanager.model.Plan;
import com.iamtomhewitt.homedashboard.recipemanager.model.Planner;
import com.iamtomhewitt.homedashboard.recipemanager.repository.PlannerRepository;
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
import static java.util.Collections.singletonList;
import static org.hamcrest.Matchers.is;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@RunWith(SpringRunner.class)
@ActiveProfiles("test")
public class PlannerServiceTests {

	@InjectMocks
	private PlannerService service;

	@Mock
	private PlannerRepository plannerRepository;

	@Rule
	public ExpectedException expectedException = ExpectedException.none();

	private Planner mockPlanner;
	private String plannerId = "12345";

	@Before
	public void eachTest() {
		mockPlanner = Planner.builder()
			.plannerId("12345")
			.plan(singletonList(Plan.builder()
				.recipe("recipe1")
				.day("Monday")
				.build()))
			.build();
	}

	@Test
	public void shouldReturnAPlanner() throws Exception {
		when(plannerRepository.findByPlannerId(anyString())).thenReturn(Optional.of(mockPlanner));

		Planner planner = service.getPlanner(plannerId);

		assertNotNull(planner);
		verify(plannerRepository, times(1)).findByPlannerId("12345");
	}

	@Test
	public void shouldThrowExceptionFindingNonExistentPlanner() throws PlannerNotFoundException {
		expectedException.expectMessage("Could not find planner with id '12345'");

		service.getPlanner(plannerId);

		verify(plannerRepository, times(1)).findByPlannerId("12345");
	}

	@Test
	public void shouldReturnMultiplePlanners() {
		when(plannerRepository.findAll()).thenReturn(asList(mockPlanner, mockPlanner));

		List<Planner> planners = service.getPlanners();

		assertNotNull(planners);
		assertThat(planners.size(), is(2));
		verify(plannerRepository, times(1)).findAll();
	}

	@Test
	public void shouldSaveAPlanner() throws PlannerExistsException {
		service.savePlanner(mockPlanner);
		verify(plannerRepository, times(1)).save(mockPlanner);
	}

	@Test
	public void shouldThrowExceptionWhenSavingExistingPlanner() throws PlannerExistsException {
		expectedException.expectMessage("Planner with id '12345' already exists");
		when(plannerRepository.findAll()).thenReturn(singletonList(mockPlanner));
		service.savePlanner(mockPlanner);
		verify(plannerRepository, times(1)).save(mockPlanner);
	}

	@Test
	public void shouldUpdatePlanner() throws PlannerNotFoundException, InvalidDayException {
		when(plannerRepository.findByPlannerId(anyString())).thenReturn(Optional.of(mockPlanner));

		Plan plan = Plan.builder().day("Monday").recipe("recipe1").build();

		service.updatePlanner(plan, plannerId);

		verify(plannerRepository, times(1)).save(mockPlanner);
	}
	@Test
	public void shouldThrowExceptionWhenUpdatingPlannerWithWrongDayFormat() throws PlannerNotFoundException, InvalidDayException {
		expectedException.expectMessage("Supplied day 'Wrong' is not valid");
		when(plannerRepository.findByPlannerId(anyString())).thenReturn(Optional.of(mockPlanner));

		Plan plan = Plan.builder().day("Wrong").recipe("recipe1").build();
		service.updatePlanner(plan, plannerId);

		verify(plannerRepository, times(1)).save(mockPlanner);
	}
}
