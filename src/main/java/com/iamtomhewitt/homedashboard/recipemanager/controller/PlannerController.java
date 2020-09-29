package com.iamtomhewitt.homedashboard.recipemanager.controller;

import com.iamtomhewitt.homedashboard.recipemanager.exception.InvalidDayException;
import com.iamtomhewitt.homedashboard.recipemanager.exception.PlannerExistsException;
import com.iamtomhewitt.homedashboard.recipemanager.exception.PlannerNotFoundException;
import com.iamtomhewitt.homedashboard.recipemanager.model.Plan;
import com.iamtomhewitt.homedashboard.recipemanager.model.Planner;
import com.iamtomhewitt.homedashboard.recipemanager.service.PlannerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/planner")
public class PlannerController {

	@Autowired
	private PlannerService service;

	@GetMapping
	public Planner getPlanner(@RequestParam String id) throws PlannerNotFoundException {
		return this.service.getPlanner(id);
	}

	@PostMapping
	public void createPlanner(@RequestBody Planner planner) throws PlannerExistsException {
		this.service.savePlanner(planner);
	}

	@PutMapping
	public void updatePlanner(@RequestBody Plan plan, @RequestParam String id) throws PlannerNotFoundException, InvalidDayException {
		this.service.updatePlanner(plan, id);
	}
}
