package com.iamtomhewitt.homedashboard.recipemanager.service;

import com.iamtomhewitt.homedashboard.recipemanager.exception.InvalidDayException;
import com.iamtomhewitt.homedashboard.recipemanager.exception.PlannerExistsException;
import com.iamtomhewitt.homedashboard.recipemanager.exception.PlannerNotFoundException;
import com.iamtomhewitt.homedashboard.recipemanager.model.Plan;
import com.iamtomhewitt.homedashboard.recipemanager.model.Planner;
import com.iamtomhewitt.homedashboard.recipemanager.repository.PlannerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlannerService {

	@Autowired
	private PlannerRepository repository;

	public Planner getPlanner(String id) throws PlannerNotFoundException {
		return repository.findByPlannerId(id).orElseThrow(() -> new PlannerNotFoundException(id));
	}

	public List<Planner> getPlanners() {
		return repository.findAll();
	}

	public void savePlanner(Planner planner) throws PlannerExistsException {
		if (getPlanners().stream().anyMatch(p -> p.getPlannerId().equals(planner.getPlannerId()))) {
			throw new PlannerExistsException(planner.getPlannerId());
		}

		this.repository.save(planner);
	}

	public void updatePlanner(Plan plan, String id) throws PlannerNotFoundException, InvalidDayException {
		Planner planner = getPlanner(id);
		planner.getPlan().stream()
			.filter(p -> p.getDay().equals(plan.getDay()))
			.findFirst()
			.orElseThrow(() -> new InvalidDayException(plan.getDay()))
			.setRecipe(plan.getRecipe());
		this.repository.save(planner);
	}
}