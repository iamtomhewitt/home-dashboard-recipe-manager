package com.iamtomhewitt.homedashboard.recipemanager.controller;

import com.iamtomhewitt.homedashboard.recipemanager.RecipeNotFoundException;
import com.iamtomhewitt.homedashboard.recipemanager.RecipeService;
import com.iamtomhewitt.homedashboard.recipemanager.model.Recipe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
}
