import { v1 as uuid } from "uuid";
import patients from "../../data/patients";
import {
  Patient,
  NonSensitivePatient,
  NewPatient,
  Entry,
  EntryWithoutId,
} from "../types";

const getAll = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const findById = (id: string): Patient | undefined => {
  return patients.find((p) => p.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = { id: uuid(), ...patient };
  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, entry: EntryWithoutId): Entry => {
  const patient = patients.find((p) => p.id === patientId);
  if (!patient) throw new Error("Patient not found");
  const newEntry = { id: uuid(), ...entry };
  patient.entries.push(newEntry);
  return newEntry;
};

export default { getAll, findById, addPatient, addEntry };
