package com.iamtomhewitt.homedashboard.recipemanager.exception;

public class PlannerExistsException extends Exception {

	public PlannerExistsException(String id) {
		super(String.format("Planner with id '%s' already exists", id));
	}
}
