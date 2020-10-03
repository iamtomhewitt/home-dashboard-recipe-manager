package com.iamtomhewitt.homedashboard.recipemanager.repository;

import com.iamtomhewitt.homedashboard.recipemanager.model.Planner;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PlannerRepository extends MongoRepository<Planner, String> {
	Optional<Planner> findByPlannerId(String plannerId);

}
