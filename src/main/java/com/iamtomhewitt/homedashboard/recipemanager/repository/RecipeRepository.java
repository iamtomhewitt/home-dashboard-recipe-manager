package com.iamtomhewitt.homedashboard.recipemanager.repository;

import com.iamtomhewitt.homedashboard.recipemanager.model.Recipe;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RecipeRepository extends MongoRepository<Recipe, String> {
	Optional<Recipe> findByName(String name);
	void deleteByName(String name);
}
