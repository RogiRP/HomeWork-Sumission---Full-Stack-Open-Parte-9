import patientData from "../../data/patients";
import { Patient, PublicPatient } from "../types";

const patients: Patient[] = patientData;

const getAll = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

export default { getAll };
