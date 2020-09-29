package com.iamtomhewitt.homedashboard.recipemanager.repository;

import com.iamtomhewitt.homedashboard.recipemanager.model.Planner;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PlannerRepository extends MongoRepository<Planner, String> {

}
