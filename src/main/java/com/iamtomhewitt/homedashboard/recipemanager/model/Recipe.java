package com.iamtomhewitt.homedashboard.recipemanager.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("recipes")
@Data
@Builder
@AllArgsConstructor
public class Recipe {
	@Id
	private String id;
	private String name;
	private List<String> steps;
	private List<Ingredient> ingredients;

	public Recipe() {}
}
