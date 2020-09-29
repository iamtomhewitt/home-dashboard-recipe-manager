package com.iamtomhewitt.homedashboard.recipemanager.exception;

public class InvalidDayException extends Exception {

	public InvalidDayException(String day) {
		super(String.format("Supplied day '%s' is not valid", day));
	}
}
