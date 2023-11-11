import { Ingredient } from "../ingredient"

export type Recipe = {
  ingredients: Ingredient[];
  name: string;
  steps: string[];
}