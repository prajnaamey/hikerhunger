from typing import Optional, List
from pydantic import BaseModel

class MacroBreakdown(BaseModel):
    """Macronutrient breakdown for a meal or daily intake"""
    carbs: int
    fat: int
    protein: int

class DailyBreakdown(BaseModel):
    """Daily breakdown of calories, macros, and hiking hours"""
    day: int
    calories: int
    macros: MacroBreakdown
    hiking_hours: float

class CalorieResponse(BaseModel):
    """Response model for calorie calculation endpoint"""
    daily_breakdown: List[DailyBreakdown]
    total_calories: int
    total_macros: MacroBreakdown

class CalorieCalculationParams(BaseModel):
    """Input parameters for calorie calculation"""
    # User Biometrics (Required)
    weight: float
    height: int
    age: int
    gender: str
    activityLevel: str
    
    # Trip Details (Required)
    tripDuration: int
    trailDistance: float
    totalelevation: int
    season: str
    
    # Trip Details Breakdown (Optional)
    day: Optional[int] = None
    trailDistanceByDay: Optional[float] = None
    totalelevationByDay: Optional[int] = None
    
    # Environmental Factors (Optional)
    averageTemperature: Optional[float] = None
    minTemperature: Optional[float] = None
    maxTemperature: Optional[float] = None
    peakaltitude: Optional[int] = None
    precipitationChance: Optional[int] = None
    
    # Pack Weight (Optional)
    baseWeight: Optional[float] = None
    waterWeight: Optional[float] = None
    
    # Hiker Experience (Optional)
    hikerExperience: Optional[str] = None 