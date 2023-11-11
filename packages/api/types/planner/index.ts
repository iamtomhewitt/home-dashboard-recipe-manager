export type Planner = {
  plan: Plan;
  plannerId: string;
  shoppingListApiKey?: string;
  shoppingListId?: string;
}

export type Plan = {
  day: string;
  recipe: string;
}[];