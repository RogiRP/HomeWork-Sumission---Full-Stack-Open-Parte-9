const calculateBmi = (height: number, weight: number): string => {
  const heightInMeters = height / 100
  const bmi = weight / (heightInMeters * heightInMeters)

  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal (healthy weight)'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

console.log(calculateBmi(180, 74))