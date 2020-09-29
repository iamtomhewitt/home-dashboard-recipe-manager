package com.iamtomhewitt.homedashboard.recipemanager;

import com.iamtomhewitt.homedashboard.recipemanager.model.Recipe;
import com.iamtomhewitt.homedashboard.recipemanager.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecipeService {

	@Autowired
	private RecipeRepository repository;

	public List<Recipe> getRecipes() {
		return repository.findAll();
	}
}
