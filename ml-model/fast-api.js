// const response = await fetch("http://127.0.0.1:8000/predict", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     contaminant_level: 2.5,
//     ph_level: 7.8,
//     turbidity: 10,
//     dissolved_oxygen: 6.5,
//     nitrate_level: 8.0,
//     lead_concentration: 3.0,
//     bacteria_count: 200,
//     water_source: "River",
//     access_to_clean_water: 75,
//     infant_mortality_rate: 15,
//     gdp: 12000,
//     healthcare_access: 70,
//     urbanization_rate: 40,
//     sanitation_coverage: 80,
//     rainfall_per_year: 1200,
//     temperature: 28,
//     population_density: 300
//   }),
// });
// const result = await response.json();
// console.log(result);