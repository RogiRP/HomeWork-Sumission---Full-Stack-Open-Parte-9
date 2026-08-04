export const calculateBmi = (height: number, weight: number): string => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);

  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal (healthy weight)";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

const height = Number(process.argv[2]);
const weight = Number(process.argv[3]);

if (!height || !weight || isNaN(height) || isNaN(weight)) {
  console.log(
    "Please provide height and weight as numbers: npm run calculateBmi <height> <weight>",
  );
} else {
  console.log(calculateBmi(height, weight));
}
