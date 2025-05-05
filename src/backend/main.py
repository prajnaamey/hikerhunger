from fastapi import FastAPI, Query, Body
from typing import Optional
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from .services.calorie_calculator import calculate_hiking_calories
from .schemas import CalorieResponse
from .schemas.meal import MealRecommendationRequest, MealRecommendationResponse
from .utils.helpers import parse_csv_param

app = FastAPI(
    title="HikerHunger API",
    description="Backend API for HikerHunger - A calorie calculator for hikers",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app's origin
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
async def root():
    return {"message": "HikerHunger API is running"}

@app.get("/v1/api/calculate-calories", response_model=CalorieResponse)
async def calculate_calories(
    # User Biometrics (Required)
    weight: float = Query(..., description="Weight in lbs"),
    height: int = Query(..., description="Height in inches"),
    age: int = Query(..., description="Age in years"),
    gender: str = Query(..., description="Gender (male, female, other)"),
    activityLevel: str = Query(..., description="Baseline activity level (sedentary, lightly_active, moderately_active, very_active, extra_active)"),
    
    # Trip Details (Required)
    tripDuration: int = Query(..., description="Duration in days"),
    trailDistance: float = Query(..., description="Total trail distance in miles"),
    totalElevation: int = Query(..., description="Total elevation gain in feet"),
    season: str = Query(..., description="Season (spring, summer, fall, winter)"),
    
    # Trip Details Breakdown (Optional)
    day: Optional[int] = Query(None, description="Day number"),
    trailDistanceByDay: Optional[str] = Query(None, description="Daily trail distance in miles (CSV)"),
    totalElevationByDay: Optional[str] = Query(None, description="Daily elevation gain in feet (CSV)"),
    
    # Environmental Factors (Optional)
    averageTemperature: Optional[float] = Query(None, description="Average temperature in Fahrenheit"),
    minTemperature: Optional[float] = Query(None, description="Minimum temperature in Fahrenheit"),
    maxTemperature: Optional[float] = Query(None, description="Maximum temperature in Fahrenheit"),
    peakAltitude: Optional[int] = Query(None, description="Peak altitude in feet"),
    precipitationChance: Optional[int] = Query(None, description="Precipitation chance percentage"),
    
    # Pack Weight (Optional)
    baseWeight: Optional[float] = Query(None, description="Base weight in lbs"),
    waterWeight: Optional[float] = Query(None, description="Water weight in lbs"),
    
    # Hiker Experience (Optional)
    hikerExperience: Optional[str] = Query(None, description="Hiker experience level (beginner, intermediate, advanced, expert)")
):
    # Prepare parameters for calculation
    params = {
        "weight": weight,
        "height": height,
        "age": age,
        "gender": gender,
        "activityLevel": activityLevel,
        "tripDuration": tripDuration,
        "trailDistance": trailDistance,
        "totalElevation": totalElevation,
        "season": season,
        "day": day,
        "trailDistanceByDay": parse_csv_param(trailDistanceByDay, float),
        "totalElevationByDay": parse_csv_param(totalElevationByDay, int),
        "averageTemperature": averageTemperature,
        "minTemperature": minTemperature,
        "maxTemperature": maxTemperature,
        "peakAltitude": peakAltitude,
        "precipitationChance": precipitationChance,
        "baseWeight": baseWeight,
        "waterWeight": waterWeight,
        "hikerExperience": hikerExperience
    }
    
    # Calculate calories using the service
    result = calculate_hiking_calories(params)
    
    # Convert TypedDict to Pydantic model
    return CalorieResponse(**result)

@app.post("/v1/api/meal-recommendations", response_model=MealRecommendationResponse)
async def get_meal_recommendations(request: MealRecommendationRequest):
    # For now, just return the input parameters
    return MealRecommendationResponse(
        totalCalories=request.totalCalories,
        totalCarbohydratesCalories=request.totalCarbohydratesCalories,
        totalProteinCalories=request.totalProteinCalories,
        totalFatCalories=request.totalFatCalories,
        dailyRequirements=request.dailyRequirements,
        tripDuration=request.tripDuration
    )

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True) 
