from typing import List, Union
from .types import (
    CalorieCalculationInput,
    CalorieCalculationResult,
    MacroBreakdown,
    DailyBreakdown,
    Gender,
    ActivityLevel,
    Season,
    HikerExperience
)

def calculate_us_pandolf_calories(weight_lbs: float, load_lbs: float, speed_mph: float, grade: float, terrain_factor: float, hours: float) -> float:
    """
    Calculate energy expenditure using a US unit adaptation of the Pandolf equation
    
    Parameters:
    - weight_lbs: Body weight in pounds
    - load_lbs: Backpack weight in pounds
    - speed_mph: Walking speed in miles per hour
    - grade: Grade/slope in percentage
    - terrain_factor: Factor accounting for terrain difficulty
    - hours: Duration of activity in hours
    
    Returns:
    - Energy expenditure in calories
    """
    # Convert to metric temporarily for equation constants (which were derived in metric)
    weight_kg = weight_lbs * 0.453592
    load_kg = load_lbs * 0.453592
    
    # Convert mph to m/s (1 mph = 0.44704 m/s)
    speed_ms = speed_mph * 0.44704
    
    # Pandolf equation components
    standing_component = 1.5 * weight_kg  # Standing metabolic rate
    
    # Avoid division by zero if weight is zero
    if weight_kg == 0:
        load_component = 0
    else:
        load_component = 2.0 * (weight_kg + load_kg) * (load_kg / weight_kg)**2
        
    walking_component = terrain_factor * (weight_kg + load_kg) * (1.5 * speed_ms**2 + 0.35 * speed_ms * grade)
    
    # Metabolic rate in watts
    metabolic_rate = standing_component + load_component + walking_component
    
    # Convert watts to kcal/min (1 watt = 0.01433 kcal/min)
    kcal_per_min = metabolic_rate * 0.01433
    
    # Total calories for the activity duration
    total_calories = kcal_per_min * 60 * hours
    
    # Add 15% for extended activity (>4 hours) to account for metabolic drift
    if hours > 4:
        total_calories *= 1.15
    
    return total_calories

def hiking_hours_calculator(params: CalorieCalculationInput, day: int) -> float:
    """Calculate expected hiking hours for a given day based on distance and elevation"""
    if isinstance(params.get("trailDistanceByDay"), list):
        distance = params["trailDistanceByDay"][day-1]
    else:
        distance = params["trailDistance"] / params["tripDuration"]
        
    if isinstance(params.get("totalelevationByDay"), list):
        elevation = params["totalelevationByDay"][day-1]
    else:
        elevation = params["totalelevation"] / params["tripDuration"]
    
    # Using modified Naismith's Rule: 3mph on flat, +1 hour per 2000ft climb
    return distance / 3 + (elevation / 2000)

def calculate_daily_calories(params: CalorieCalculationInput, day: int) -> int:
    """Calculate daily calorie requirements for a specific day of the trip"""
    # 1. Calculate Basal Metabolic Rate (BMR)
    if params["gender"] == Gender.MALE:
        bmr = (4.536 * params["weight"]) + (15.88 * params["height"]) - (5 * params["age"]) + 5
    else:
        bmr = (4.536 * params["weight"]) + (15.88 * params["height"]) - (5 * params["age"]) - 161
    
    # 2. Activity factor for non-hiking baseline
    activity_factors = {
        ActivityLevel.SEDENTARY: 1.2,
        ActivityLevel.LIGHTLY_ACTIVE: 1.375,
        ActivityLevel.MODERATELY_ACTIVE: 1.55,
        ActivityLevel.VERY_ACTIVE: 1.725,
        ActivityLevel.EXTRA_ACTIVE: 1.9
    }
    base_calories = bmr * activity_factors[params["activityLevel"]]
    
    # 3. Get day-specific hiking parameters
    if isinstance(params.get("trailDistanceByDay"), list):
        distance = params["trailDistanceByDay"][day-1]
    else:
        distance = params["trailDistance"] / params["tripDuration"]
        # Apply fatigue factor for multi-day hikes
        if params["tripDuration"] > 1:
            fatigue_factor = min(1.0 + (day - 1) * 0.02, 1.1)
            distance *= fatigue_factor
            
    if isinstance(params.get("totalelevationByDay"), list):
        elevation = params["totalelevationByDay"][day-1]
    else:
        elevation = params["totalelevation"] / params["tripDuration"]
    
    # 4. Calculate hiking duration
    hiking_hours = distance / 3 + (elevation / 2000)
    
    # 5. Get pack weight - handle None values properly
    base_weight = params.get("baseWeight") or 0
    water_weight = params.get("waterWeight") or 0
    pack_weight = base_weight + water_weight
    
    # 6. Apply terrain factor based on season
    terrain_factors = {
        Season.WINTER: 1.3,
        Season.FALL: 1.1,
        Season.SUMMER: 1.05,
        Season.SPRING: 1.15
    }
    terrain_factor = terrain_factors.get(params["season"], 1.0)
    
    # 7. Calculate grade
    grade = (elevation / (distance * 5280)) * 100 if distance > 0 else 0
    
    # 8. Calculate hiking calories using Pandolf-based equation
    # Convert to metric for calculation
    weight_kg = params["weight"] * 0.453592
    load_kg = pack_weight * 0.453592
    speed_ms = 3.0 * 0.44704  # 3 mph to m/s
    
    # Pandolf components
    standing = 1.5 * weight_kg
    if weight_kg > 0:
        load_component = 2.0 * (weight_kg + load_kg) * (load_kg / weight_kg)**2
    else:
        load_component = 0
    walking = terrain_factor * (weight_kg + load_kg) * (1.5 * speed_ms**2 + 0.35 * speed_ms * grade)
    
    metabolic_rate = standing + load_component + walking
    kcal_per_min = metabolic_rate * 0.01433
    hiking_calories = kcal_per_min * 60 * hiking_hours
    
    # Apply extended activity factor
    if hiking_hours > 4:
        hiking_calories *= 1.15
    
    # 9. Apply environmental adjustments
    # Temperature adjustment
    temp_factor = 1.0
    if params.get("averageTemperature"):
        temp = params["averageTemperature"]
        if temp > 75:
            temp_factor += (temp - 75) * 0.01
        elif temp < 40:
            temp_factor += (40 - temp) * 0.01
    
    # Altitude adjustment
    altitude_factor = 1.0
    if params.get("peakaltitude") and params["peakaltitude"] > 5000:
        altitude_factor += (params["peakaltitude"] - 5000) / 3000 * 0.05
    
    # Experience adjustment
    experience_factors = {
        HikerExperience.BEGINNER: 1.1,
        HikerExperience.INTERMEDIATE: 1.0,
        HikerExperience.ADVANCED: 0.95,
        HikerExperience.EXPERT: 0.9
    }
    experience_factor = experience_factors.get(params.get("hikerExperience", HikerExperience.INTERMEDIATE), 1.0)
    
    # 10. Calculate final hiking calories
    adjusted_hiking_calories = hiking_calories * temp_factor * altitude_factor * experience_factor
    
    # 11. Total daily calories
    total_calories = base_calories + adjusted_hiking_calories
    
    return round(total_calories / 50) * 50  # Round to nearest 50

def calculate_daily_macros(params: CalorieCalculationInput, day: int) -> MacroBreakdown:
    """Calculate macronutrient breakdown for a specific day"""
    daily_calories = calculate_daily_calories(params, day)
    
    # Adjust macro ratios based on day of trip
    if day == 1:
        carb_pct = 0.55
        fat_pct = 0.30
        protein_pct = 0.15
    else:
        carb_pct = max(0.45, 0.55 - (day - 1) * 0.01)
        fat_pct = min(0.40, 0.30 + (day - 1) * 0.01)
        protein_pct = 0.15
    
    # Calculate grams of each macronutrient
    carbs = round((daily_calories * carb_pct) / 4)  # 4 calories per gram
    fat = round((daily_calories * fat_pct) / 9)    # 9 calories per gram
    protein = round((daily_calories * protein_pct) / 4)  # 4 calories per gram
    
    return {
        "carbs": carbs,
        "fat": fat,
        "protein": protein
    }

def calculate_total_calories(params: CalorieCalculationInput) -> int:
    """Calculate total calories for the entire trip"""
    total = 0
    for day in range(1, params["tripDuration"] + 1):
        total += calculate_daily_calories(params, day)
    return total

def calculate_total_macros(params: CalorieCalculationInput) -> MacroBreakdown:
    """Calculate total macros for the entire trip"""
    total_carbs = 0
    total_fat = 0
    total_protein = 0
    
    for day in range(1, params["tripDuration"] + 1):
        macros = calculate_daily_macros(params, day)
        total_carbs += macros["carbs"]
        total_fat += macros["fat"]
        total_protein += macros["protein"]
    
    return {
        "carbs": total_carbs,
        "fat": total_fat,
        "protein": total_protein
    }

def calculate_hiking_calories(params: CalorieCalculationInput) -> CalorieCalculationResult:
    """
    Main function to calculate calories and macros for the entire trip
    Returns a comprehensive breakdown of daily and total requirements
    """
    # Calculate daily requirements
    daily_breakdown = []
    for day in range(1, params["tripDuration"] + 1):
        daily_calories = calculate_daily_calories(params, day)
        daily_macros = calculate_daily_macros(params, day)
        hiking_hours = hiking_hours_calculator(params, day)
        
        daily_breakdown.append({
            "day": day,
            "calories": daily_calories,
            "macros": daily_macros,
            "hiking_hours": round(hiking_hours, 1)
        })
    
    # Calculate totals
    total_calories = calculate_total_calories(params)
    total_macros = calculate_total_macros(params)
    
    return {
        "daily_breakdown": daily_breakdown,
        "total_calories": total_calories,
        "total_macros": total_macros
    } 