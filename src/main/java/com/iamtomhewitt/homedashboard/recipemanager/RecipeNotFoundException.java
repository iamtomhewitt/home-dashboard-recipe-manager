package com.iamtomhewitt.homedashboard.recipemanager;

public class RecipeNotFoundException extends Exception {

	public RecipeNotFoundException(String name) {
		super(String.format("Could not find recipe with name '%s'", name));
	}
}
