package com.iamtomhewitt.homedashboard.recipemanager.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class Ingredient {
	private String name;
	private String category;
	private double amount;
	private String weight;

	public Ingredient() {}
}
