package com.iamtomhewitt.homedashboard.recipemanager.controller;

import com.iamtomhewitt.homedashboard.recipemanager.exception.PlannerNotFoundException;
import com.iamtomhewitt.homedashboard.recipemanager.service.ShoppingListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/shoppingList")
public class ShoppingListController {

	@Autowired
	private ShoppingListService service;

	@GetMapping
	public List<String> getShoppingList(@RequestParam String id) throws PlannerNotFoundException {
		return this.service.getShoppingList(id);
	}
}
