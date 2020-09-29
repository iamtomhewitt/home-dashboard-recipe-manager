package com.iamtomhewitt.homedashboard.recipemanager.controller;

import com.iamtomhewitt.homedashboard.recipemanager.RecipeService;
import com.iamtomhewitt.homedashboard.recipemanager.model.Recipe;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/recipes")
public class RecipeController {

	@Autowired
	private RecipeService service;

	@GetMapping
	public List<Recipe> getRecipes() {
		return this.service.getRecipes();
	}
}
