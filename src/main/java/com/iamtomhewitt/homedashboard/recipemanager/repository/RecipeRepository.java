package com.iamtomhewitt.homedashboard.recipemanager.repository;

import com.iamtomhewitt.homedashboard.recipemanager.model.Recipe;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RecipeRepository extends MongoRepository<Recipe, String> {
	Recipe findByName(String name);
}
