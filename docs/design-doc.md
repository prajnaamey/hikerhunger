# HikerHunger - System Design Document

## Overview
HikerHunger is a web application that helps hikers calculate their caloric needs and recommends appropriate meals for backpacking trips, eliminating the need for cumbersome spreadsheets and manual calculations.

## Functional Requirements
1. Accept user inputs:
   - User biometrics: weight, height, gender
   - Trail info: days, length, elevation, location, weather conditions
2. Calculate calorie requirements based on user criteria using established formulae
3. Provide meal recommendations that meet calorie requirements from a pre-defined database
4. Present meal plan to the user in a tabular format with daily breakdowns

## Scope
1. Web application only (no mobile app in initial version)
2. No persistent user data storage
3. No user authentication
4. Pre-defined meal database (no AI-generated recommendations)
5. No export functionality (shopping lists, downloadable formats)
6. No dietary restriction options in initial version

## Non-Functional Requirements
1. High availability (99.9% uptime target)
2. Low latency (<1s response time for calculations)
3. Basic scalability sufficient for early adoption
4. Mobile-responsive web design
5. Secure handling of temporary user inputs

## Technical Architecture
1. Frontend: TypeScript + React
   - Single-page application
   - Responsive design using modern CSS framework
   - Form validation on client-side

2. Backend: Python
   - RESTful API service
   - In-memory meal data caching during service startup
   - Calorie calculation logic
   - Meal recommendation algorithm based on cached data

3. Database: MongoDB
   - Used only for storing meal options
   - Read-only operations after initial setup
   - No user data persistence

4. Infrastructure: 
   - AWS EC2 or serverless solution (TBD)
   - AWS Load Balancer
   - Single region deployment (US-West-2)

### Single-Region Deployment Rationale
We're keeping the initial deployment simple with a single-region approach because:
- Expected low initial user traffic
- New product in validation phase
- Reduced operational complexity
- Lower infrastructure costs
- Adequate performance for target audience
- Easier monitoring and troubleshooting

## API Design
### Endpoints:

1. `/v1/api/calculate-calories` (GET)
*  Query parameters for user biometrics and trail information
* Returns calculated calorie requirements
* Stateless operation with no data persistence

API
```
GET /v1/api/calculate-calories
```

**Request Parameters**

User Biometrics (Required)
* weight: integer (in lbs)
* height: integer (in inch)
* age: integer (years)
* gender: string (enum: "male", "female", "other")
* activityLevel: string (enum: "sedentary", "lightly_active", "moderately_active", "very_active", "extra_active") - baseline activity level when not hiking

Trip Details (Required)
* tripDuration: integer (days)
* trailDistance: float (in miles)
* totalelevation: integer (total ft of ascent)
* season: string (enum: "spring", "summer", "fall", "winter")

Trip Details Breakdown (Optional)
* day: integer
* trailDistanceByDay: float (in miles)
* totalelevationByDay: integer (total ft of ascent)

Environmental Factors (Optional)
* averageTemperature: float (in F)
* minTemperature: float (in F)
* maxTemperature: float (in F)
* peakaltitude: integer (average altitude in ft)
* precipitationChance: integer (percentage)

Pack Weight (Optional)
* baseWeight: float (in lbs, weight of pack excluding consumables)
* waterWeight: float (in lbs, estimated average water carried)

Hiker Experience (Optional)
* hikerExperience: string (enum: "beginner", "intermediate", "advanced", "expert")

Response

```
{
  "dailyCalories": {
    "total": integer,
    "breakdown": {
      "bmr": integer,
      "activityCalories": integer,
      "elevationCalories": integer,
      "temperatureAdjustment": integer,
      "packWeightAdjustment": integer,
      "altitudeAdjustment": integer
    }
  },
  "totalTripCalories": integer,
  "dailyBreakdown": [
    {
      "day": integer,
      "calories": integer,
      "factors": {
        "distance": float,
        "elevation": integer,
        "temperature": float,
        "difficulty": string
      }
    }
  ],
  "macronutrientSuggestion": {
    "carbohydratesGrams": integer,
    "carbohydratesCalories": integer,
    "carbohydratesPercentage": integer,
    "proteinGrams": integer,
    "proteinCalories": integer,
    "proteinPercentage": integer,
    "fatGrams": integer,
    "fatCalories": integer,
    "fatPercentage": integer
  },
  "hydrationNeeds": {
    "baseLiters": float,
    "additionalLitersPerHour": float,
    "recommendedDailyTotal": float
  }
}

```

2. `/v1/api/calculate-calories` (GET)

   - Query parameters for calorie requirements
   - Returns recommended meal plans
   - No user data storage


API
```
GET /v1/api/meal-recommendations

```

**Request Parameters**

Calorie Requirements (Required)

* totalCalories: integer (total calories for entire trip)
* totalCarbohydratesCalories: integer (total carbohydrate calories)
* totalProteinCalories: integer (total protein calories)
* totalFatCalories: integer (total fat calories)

Daily Breakdown (Required)

* dailyRequirements: array of objects
    * day: integer (day number)
    * calories: integer (calories for this day)
    * carbohydratesCalories: integer (carb calories for this day)
    * proteinCalories: integer (protein calories for this day)
    * fatCalories: integer (fat calories for this day)

Trip Details (Required)

* tripDuration: integer (number of days)

Response:
```
{
  "mealPlan": {
    "totalTripCalories": integer,
    "totalTripWeight": float,
    "totalMealCount": integer,
    "totalSnackCount": integer,
    "macroBreakdown": {
      "carbohydrates": {
        "grams": integer,
        "calories": integer,
        "percentage": integer
      },
      "protein": {
        "grams": integer,
        "calories": integer,
        "percentage": integer
      },
      "fat": {
        "grams": integer,
        "calories": integer,
        "percentage": integer
      }
    }
  },
  "dailyMealPlans": [
    {
      "day": integer,
      "totalDayCalories": integer,
      "totalDayWeight": float,
      "meals": {
        "breakfast": [
          {
            "name": string,
            "calories": integer,
            "weight": float,
            "carbohydrates": integer,
            "protein": integer,
            "fat": integer,
            "prepTime": integer
          }
        ],
        "lunch": [
          {
            "name": string,
            "calories": integer,
            "weight": float,
            "carbohydrates": integer,
            "protein": integer,
            "fat": integer,
            "prepTime": integer
          }
        ],
        "dinner": [
          {
            "name": string,
            "calories": integer,
            "weight": float,
            "carbohydrates": integer,
            "protein": integer,
            "fat": integer,
            "prepTime": integer
          }
        ],
        "snacks": [
          {
            "name": string,
            "calories": integer,
            "weight": float,
            "carbohydrates": integer,
            "protein": integer,
            "fat": integer
          }
        ]
      }
    }
  ]
}
```

3. `/api/meals` (GET)
   - Returns available meal options from database

## Data Model
The database will only contain meal information and related metadata. The service will load all meals into memory cache during initialization for faster computation and reduced database queries.

### Collection:
1. `meals`

```
{
    _id: ObjectId,
    name: String,
    calories: Number,
    weight: Number,
    mealType: String, // "breakfast", "lunch", "dinner", "snack"
    ingredients: Array,
    prepTime: Number
}
```

## Future Considerations
1. User accounts for saving trip plans
2. Mobile application
3. Dietary restrictions and preferences
5. Multi-region deployment for increased reliability
4. Export functionality
6. Weather API integration for more accurate calculations
