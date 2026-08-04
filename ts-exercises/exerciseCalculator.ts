interface Result {
  periodLength: number
  trainingDays: number
  success: boolean
  rating: number
  ratingDescription: string
  target: number
  average: number
}

export const calculateExercises = (hours: number[], target: number): Result => {
  const periodLength = hours.length
  const trainingDays = hours.filter(h => h > 0).length
  const average = hours.reduce((sum, h) => sum + h, 0) / periodLength
  const success = average >= target

  let rating: number
  let ratingDescription: string

  if (average >= target) {
    rating = 3
    ratingDescription = 'excellent work, target reached!'
  } else if (average >= target * 0.75) {
    rating = 2
    ratingDescription = 'not too bad but could be better'
  } else {
    rating = 1
    ratingDescription = 'needs more effort'
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  }
}