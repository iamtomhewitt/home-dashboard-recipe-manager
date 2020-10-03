package com.iamtomhewitt.homedashboard.recipemanager.service;

import com.iamtomhewitt.homedashboard.recipemanager.exception.RecipeExistsException;
import com.iamtomhewitt.homedashboard.recipemanager.exception.RecipeNotFoundException;
import com.iamtomhewitt.homedashboard.recipemanager.model.Recipe;
import com.iamtomhewitt.homedashboard.recipemanager.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecipeService {

	@Autowired
	private RecipeRepository repository;

	public Recipe getRecipe(String name) throws RecipeNotFoundException {
		return repository.findByName(name).orElseThrow(() -> new RecipeNotFoundException(name));
	}

	public List<Recipe> getRecipes() {
		return repository.findAll();
	}

	public void saveRecipe(Recipe recipe) throws RecipeExistsException {
		if (getRecipes().stream().anyMatch(r -> r.getName().equals(recipe.getName()))) {
			throw new RecipeExistsException(recipe.getName());
		}

		this.repository.save(recipe);
	}

	public void updateRecipe(Recipe recipe) {
		this.repository.save(recipe);
	}

	public void deleteRecipe(String name) {
		this.repository.deleteByName(name);
	}
}