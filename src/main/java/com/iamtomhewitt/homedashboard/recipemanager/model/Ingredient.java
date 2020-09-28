package com.iamtomhewitt.homedashboard.recipemanager.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
@Builder
@AllArgsConstructor
public class Ingredient {

	@Id
	private String id;
	private String name;
	private String category;
	private double amount;
	private String weight;

	public Ingredient() {}
}
