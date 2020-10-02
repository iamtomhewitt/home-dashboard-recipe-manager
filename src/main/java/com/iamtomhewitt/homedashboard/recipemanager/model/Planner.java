package com.iamtomhewitt.homedashboard.recipemanager.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("planners")
@Data
@Builder
@AllArgsConstructor
public class Planner {
	private String id;
	private List<Plan> plan;

	public Planner() {}
}
