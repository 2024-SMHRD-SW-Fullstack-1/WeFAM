package com.izg.back_end.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "cook")
public class CookModel {
	@Id 
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "cook_idx", nullable = false)
	private int cookIdx;
	
	@Column(name = "recipe_idx", nullable = false)
	private int recipeIdx;
	
	@Column(name = "cook_image", nullable = false)
	private String image;
}
