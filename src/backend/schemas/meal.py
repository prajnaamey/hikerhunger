from typing import List, Optional
from pydantic import BaseModel

class DailyRequirement(BaseModel):
    """Daily calorie and macronutrient requirements"""
    day: int
    calories: int
    carbohydratesCalories: int
    proteinCalories: int
    fatCalories: int

class MealRecommendationRequest(BaseModel):
    """Input parameters for meal recommendations"""
    # Calorie Requirements (Required)
    totalCalories: int
    totalCarbohydratesCalories: int
    totalProteinCalories: int
    totalFatCalories: int
    
    # Daily Breakdown (Required)
    dailyRequirements: List[DailyRequirement]
    
    # Trip Details (Required)
    tripDuration: int

class MealRecommendationResponse(BaseModel):
    """Response model for meal recommendations"""
    # For now, just echo back the input parameters
    totalCalories: int
    totalCarbohydratesCalories: int
    totalProteinCalories: int
    totalFatCalories: int
    dailyRequirements: List[DailyRequirement]
    tripDuration: int 