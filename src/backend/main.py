from fastapi import FastAPI, Query
from typing import Optional
import uvicorn

app = FastAPI(
    title="HikerHunger API",
    description="Backend API for HikerHunger - A calorie calculator for hikers",
    version="1.0.0"
)

@app.get("/")
async def root():
    return {"message": "HikerHunger API is running"}

@app.get("/v1/api/calculate-calories")
async def calculate_calories(
    # User Biometrics (Required)
    weight: int = Query(..., description="Weight in lbs"),
    height: int = Query(..., description="Height in inches"),
    age: int = Query(..., description="Age in years"),
    gender: str = Query(..., description="Gender (male, female, other)"),
    activityLevel: str = Query(..., description="Baseline activity level (sedentary, lightly_active, moderately_active, very_active, extra_active)"),
    
    # Trip Details (Required)
    tripDuration: int = Query(..., description="Duration in days"),
    trailDistance: float = Query(..., description="Total trail distance in miles"),
    totalelevation: int = Query(..., description="Total elevation gain in feet"),
    season: str = Query(..., description="Season (spring, summer, fall, winter)"),
    
    # Trip Details Breakdown (Optional)
    day: Optional[int] = Query(None, description="Day number"),
    trailDistanceByDay: Optional[float] = Query(None, description="Daily trail distance in miles"),
    totalelevationByDay: Optional[int] = Query(None, description="Daily elevation gain in feet"),
    
    # Environmental Factors (Optional)
    averageTemperature: Optional[float] = Query(None, description="Average temperature in Fahrenheit"),
    minTemperature: Optional[float] = Query(None, description="Minimum temperature in Fahrenheit"),
    maxTemperature: Optional[float] = Query(None, description="Maximum temperature in Fahrenheit"),
    peakaltitude: Optional[int] = Query(None, description="Peak altitude in feet"),
    precipitationChance: Optional[int] = Query(None, description="Precipitation chance percentage"),
    
    # Pack Weight (Optional)
    baseWeight: Optional[float] = Query(None, description="Base weight in lbs"),
    waterWeight: Optional[float] = Query(None, description="Water weight in lbs"),
    
    # Hiker Experience (Optional)
    hikerExperience: Optional[str] = Query(None, description="Hiker experience level (beginner, intermediate, advanced, expert)")
):
    # Simply return all the parameters that were passed in
    return {
        "user_biometrics": {
            "weight": weight,
            "height": height,
            "age": age,
            "gender": gender,
            "activityLevel": activityLevel
        },
        "trip_details": {
            "tripDuration": tripDuration,
            "trailDistance": trailDistance,
            "totalelevation": totalelevation,
            "season": season
        },
        "trip_breakdown": {
            "day": day,
            "trailDistanceByDay": trailDistanceByDay,
            "totalelevationByDay": totalelevationByDay
        },
        "environmental_factors": {
            "averageTemperature": averageTemperature,
            "minTemperature": minTemperature,
            "maxTemperature": maxTemperature,
            "peakaltitude": peakaltitude,
            "precipitationChance": precipitationChance
        },
        "pack_weight": {
            "baseWeight": baseWeight,
            "waterWeight": waterWeight
        },
        "hiker_experience": hikerExperience
    }

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True) 
