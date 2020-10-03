package com.iamtomhewitt.homedashboard.recipemanager.exception;

public class RecipeExistsException extends Exception {

	public RecipeExistsException(String name) {
		super(String.format("Recipe '%s' already exists", name));
	}
}
