package com.iamtomhewitt.homedashboard.recipemanager.service;

import com.iamtomhewitt.homedashboard.recipemanager.exception.PlannerNotFoundException;
import com.iamtomhewitt.homedashboard.recipemanager.model.Ingredient;
import com.iamtomhewitt.homedashboard.recipemanager.model.Planner;
import com.iamtomhewitt.homedashboard.recipemanager.model.Recipe;
import com.iamtomhewitt.homedashboard.recipemanager.repository.PlannerRepository;
import com.iamtomhewitt.homedashboard.recipemanager.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static java.util.Comparator.comparing;

@Service
public class ShoppingListService {

	@Autowired
	private PlannerRepository plannerRepository;

	@Autowired
	private RecipeRepository recipeRepository;

	public List<String> getShoppingList(String id) throws PlannerNotFoundException {
		Planner planner = plannerRepository.findByPlannerId(id).orElseThrow(() -> new PlannerNotFoundException(id));

		List<Ingredient> currentItems = new ArrayList<>();
		List<String> shoppingList = new ArrayList<>();

		planner.getPlan().forEach(plan -> {
			Optional<Recipe> optionalRecipe = recipeRepository.findByName(plan.getRecipe());

			if (optionalRecipe.isPresent()) {
				Recipe recipe = optionalRecipe.get();
				recipe.getIngredients().forEach(ingredient -> {
					Optional<Ingredient> existing = currentItems.stream()
						.filter(i -> i.getName().equals(ingredient.getName()) && i.getWeight().equals(ingredient.getWeight()))
						.findFirst();

					if (existing.isPresent()) {
						Ingredient i = existing.get();
						double newAmount = i.getAmount() + ingredient.getAmount();
						i.setAmount(newAmount);
					} else {
						currentItems.add(ingredient);
					}
				});
			}
		});

		currentItems.sort(comparing(Ingredient::getCategory));
		currentItems.forEach(item -> {
			shoppingList.add(String.format("%s %s of %s", Math.round(item.getAmount()), item.getWeight(), item.getName()).replace(" grams", "g"));
		});

		return shoppingList;
	}
}