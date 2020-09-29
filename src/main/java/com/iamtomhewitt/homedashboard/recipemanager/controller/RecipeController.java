package com.iamtomhewitt.homedashboard.recipemanager.controller;

import com.iamtomhewitt.homedashboard.recipemanager.service.RecipeService;
import com.iamtomhewitt.homedashboard.recipemanager.exception.RecipeExistsException;
import com.iamtomhewitt.homedashboard.recipemanager.exception.RecipeNotFoundException;
import com.iamtomhewitt.homedashboard.recipemanager.model.Recipe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recipes")
public class RecipeController {

	@Autowired
	private RecipeService service;

	@GetMapping(params = "name")
	public Recipe getRecipe(@RequestParam String name) throws RecipeNotFoundException {
		return this.service.getRecipe(name);
	}

	@GetMapping
	public List<Recipe> getRecipes() {
		return this.service.getRecipes();
	}

	@PostMapping
	public void saveRecipe(@RequestBody Recipe recipe) throws RecipeExistsException {
		this.service.saveRecipe(recipe);
	}

	@PutMapping
	public void updateRecipe(@RequestBody Recipe recipe) {
		this.service.updateRecipe(recipe);
	}

	@DeleteMapping
	public void deleteRecipe(@RequestParam String name) {
		this.service.deleteRecipe(name);
	}
}
