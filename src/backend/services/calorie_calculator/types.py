from typing import Optional, List, TypedDict, Union
from enum import Enum

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class ActivityLevel(str, Enum):
    SEDENTARY = "sedentary"
    LIGHTLY_ACTIVE = "lightly_active"
    MODERATELY_ACTIVE = "moderately_active"
    VERY_ACTIVE = "very_active"
    EXTRA_ACTIVE = "extra_active"

class Season(str, Enum):
    SPRING = "spring"
    SUMMER = "summer"
    FALL = "fall"
    WINTER = "winter"

class HikerExperience(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class MacroBreakdown(TypedDict):
    carbs: int
    fat: int
    protein: int

class DailyBreakdown(TypedDict):
    day: int
    calories: int
    macros: MacroBreakdown
    hiking_hours: float

class CalorieCalculationResult(TypedDict):
    daily_breakdown: List[DailyBreakdown]
    total_calories: int
    total_macros: MacroBreakdown

class CalorieCalculationInput(TypedDict, total=False):
    # User Biometrics (Required)
    weight: int
    height: int
    age: int
    gender: Gender
    activityLevel: ActivityLevel
    
    # Trip Details (Required)
    tripDuration: int
    trailDistance: float
    totalelevation: int
    season: Season
    
    # Trip Details Breakdown (Optional)
    day: Optional[int]
    trailDistanceByDay: Optional[Union[float, List[float]]]
    totalelevationByDay: Optional[Union[int, List[int]]]
    
    # Environmental Factors (Optional)
    averageTemperature: Optional[float]
    minTemperature: Optional[float]
    maxTemperature: Optional[float]
    peakaltitude: Optional[int]
    precipitationChance: Optional[int]
    
    # Pack Weight (Optional)
    baseWeight: Optional[float]
    waterWeight: Optional[float]
    
    # Hiker Experience (Optional)
    hikerExperience: Optional[HikerExperience] 