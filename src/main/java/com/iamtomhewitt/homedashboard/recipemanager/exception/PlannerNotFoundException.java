package com.iamtomhewitt.homedashboard.recipemanager.exception;

public class PlannerNotFoundException extends Exception {

	public PlannerNotFoundException(String id) {
		super(String.format("Could not find planner with id '%s'", id));
	}
}
