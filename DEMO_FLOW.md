# EcoMentor AI - Judge Demo Script

This document outlines the recommended demonstration flow for judges evaluating EcoMentor AI. It is designed to logically step through the application's core features, highlighting the underlying architecture and engines at play.

---

## Step 1: Open Home Page
*   **User Action**: The judge opens the web application via the local server (`http://localhost:3000`) or deployed URL.
*   **System Behavior**: The Next.js application initializes, loading the global state via React Context and hydrating data from `localStorage`.
*   **Expected Output**: A welcoming, premium landing page clearly stating the value proposition of EcoMentor AI.
*   **Engine Involved**: Core UI / Next.js App Router

## Step 2: Navigate to Calculator
*   **User Action**: The judge clicks the "Log Activity" or "Calculator" button in the navigation menu.
*   **System Behavior**: The application routes to the Calculator view. The system prepares the input forms for new data entry.
*   **Expected Output**: An intuitive, structured form presenting categories like Transportation, Energy, and Food.
*   **Engine Involved**: Core UI / State Management

## Step 3: Log Transportation Activity
*   **User Action**: The judge selects the "Transportation" category, inputs "15 miles driven in a gasoline car", and clicks "Save".
*   **System Behavior**: The raw input is dispatched to the global state. The Carbon Engine intercepts this data, applies emission factors, and calculates the exact $CO_2e$.
*   **Expected Output**: A success notification confirms the entry. The activity is added to the day's log.
*   **Engine Involved**: **Carbon Engine**

## Step 4: Log Food Activity
*   **User Action**: The judge switches to the "Food" category, logs a "High Meat meal", and clicks "Save".
*   **System Behavior**: Similar to the previous step, the system dispatches the data. The application aggregates this new meal data with the previously logged transportation data to update the cumulative footprint.
*   **Expected Output**: A success notification appears, confirming the meal has been factored into the total carbon footprint.
*   **Engine Involved**: **Carbon Engine**

## Step 5: View Dashboard
*   **User Action**: The judge navigates to the "Dashboard".
*   **System Behavior**: The dashboard components read the newly updated, aggregated Carbon Report from the React Context. Recharts dynamically processes and renders the visual data.
*   **Expected Output**: Interactive charts (e.g., Donut charts for category breakdown, Bar charts for historical trends) update in real-time, instantly reflecting the impact of the car ride and meat consumption.
*   **Engine Involved**: Core UI / Data Visualization

## Step 6: Review Recommendations
*   **User Action**: The judge clicks on the "Recommendations" page.
*   **System Behavior**: The Recommendation Engine analyzes the user's highest emission categories from recent logs and maps them to predefined, high-impact reduction strategies.
*   **Expected Output**: A prioritized list of actionable tips appears (e.g., "Consider carpooling to reduce your high transportation footprint" or "Try a plant-based meal tomorrow").
*   **Engine Involved**: **Recommendation Engine**

## Step 7: Review AI Coach Insights
*   **User Action**: The judge opens the "AI Coach" view.
*   **System Behavior**: The rule-based AI Coach Engine evaluates the user's overall trajectory, comparing recent logs against baselines to generate contextual, personalized feedback.
*   **Expected Output**: A conversational and encouraging message from the AI Coach. For example, it might gently point out the recent spike in emissions from driving and suggest setting a goal for the week.
*   **Engine Involved**: **AI Coach Engine**

## Step 8: Check Weekly Challenges
*   **User Action**: The judge navigates to the "Challenges" section.
*   **System Behavior**: The system queries active weekly challenges. The Challenge Engine checks the user's recent logs to determine if criteria for any specific challenge have been met.
*   **Expected Output**: A dashboard of active and completed challenges. Progress bars visually indicate how close the user is to finishing a challenge (e.g., 1/3 days completed for a "Walk to Work" challenge).
*   **Engine Involved**: **Challenge Engine**

## Step 9: Observe Streak Updates
*   **User Action**: The judge views the user's streak counter, visible in the Header or Profile.
*   **System Behavior**: Upon the first successful log of the day (from Steps 3 & 4), the Streak Engine verified the date of the last log. Since a log was recorded today, the streak is incremented or initiated.
*   **Expected Output**: A celebratory visual indicator showing a "1-Day Streak!" (or higher), demonstrating the application's gamification features.
*   **Engine Involved**: **Streak Engine**

## Step 10: Use What-If Simulator
*   **User Action**: The judge navigates to the "What-If Simulator", adjusts sliders to simulate "Switching to an EV", and toggles a "Vegan Diet".
*   **System Behavior**: The simulator isolates these hypothetical inputs from the persistent state. It runs these variables through the Carbon Engine to project theoretical future emissions against the user's actual baseline.
*   **Expected Output**: Dynamic graphs update instantly to show the projected reduction in the user's carbon footprint, providing a powerful visual demonstration of lifestyle changes.
*   **Engine Involved**: **Carbon Engine** (Simulation Mode)

## Step 11: Update Profile Preferences
*   **User Action**: The judge navigates to "Profile" and updates their baseline country or default dietary preference.
*   **System Behavior**: The React Context updates the user's baseline configuration and immediately triggers a serialization event to save the new preferences to `localStorage`.
*   **Expected Output**: A confirmation that the profile has been updated. The judge is informed that all subsequent calculations across the application will now dynamically utilize these newly established baseline metrics.
*   **Engine Involved**: State Management / `localStorage`
