interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (hours: number[], target: number): Result => {
  const periodLength = hours.length;
  const trainingDays = hours.filter((h) => h > 0).length;
  const average = hours.reduce((sum, h) => sum + h, 0) / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = "excellent work, target reached!";
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else {
    rating = 1;
    ratingDescription = "needs more effort";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(
    "Please provide target and at least one day: npm run calculateExercises <target> <day1> <day2> ...",
  );
} else {
  const target = Number(args[0]);
  const hours = args.slice(1).map(Number);

  if (isNaN(target) || hours.some(isNaN)) {
    console.log("All arguments must be numbers");
  } else {
    console.log(calculateExercises(hours, target));
  }
}
