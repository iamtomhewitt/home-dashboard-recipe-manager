package com.iamtomhewitt.homedashboard.recipemanager.model;

import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("recipes")
@Data
@Builder
public class Recipe {
	@Id
	private String id;
	private String name;
	private List<String> steps;
	private List<Ingredient> ingredients;

	public Recipe() {}
}
