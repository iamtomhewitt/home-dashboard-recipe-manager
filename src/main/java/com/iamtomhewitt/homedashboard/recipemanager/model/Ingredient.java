package com.iamtomhewitt.homedashboard.recipemanager.model;

import org.springframework.data.annotation.Id;

import java.util.List;

public class Ingredient {

	@Id
	private String id;
	private String name;
	private String category;
	private double amount;
	private String weight;

	public Ingredient() {}
}
