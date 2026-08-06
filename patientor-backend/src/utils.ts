import { NewPatient, Gender, EntryWithoutId, HealthCheckRating } from "./types";
import { Diagnose } from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) throw new Error("Incorrect or missing name");
  return name;
};

const parseDateOfBirth = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date))
    throw new Error("Incorrect or missing date of birth");
  return date;
};

const parseSsn = (ssn: unknown): string => {
  if (!ssn || !isString(ssn)) throw new Error("Incorrect or missing ssn");
  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender))
    throw new Error("Incorrect or missing gender");
  return gender;
};

const parseOccupation = (occupation: unknown): string => {
  if (!occupation || !isString(occupation))
    throw new Error("Incorrect or missing occupation");
  return occupation;
};

const parseString = (value: unknown, field: string): string => {
  if (!value || !isString(value))
    throw new Error(`Incorrect or missing ${field}`);
  return value;
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (
    rating === undefined ||
    rating === null ||
    typeof rating !== "number" ||
    !isHealthCheckRating(rating)
  ) {
    throw new Error("Incorrect or missing healthCheckRating");
  }
  return rating;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnose["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    return [] as Array<Diagnose["code"]>;
  }
  return object.diagnosisCodes as Array<Diagnose["code"]>;
};

export const toNewEntry = (object: unknown): EntryWithoutId => {
  if (!object || typeof object !== "object")
    throw new Error("Incorrect or missing data");
  const obj = object as Record<string, unknown>;

  if (!obj.type || !isString(obj.type))
    throw new Error("Incorrect or missing type");

  const base = {
    description: parseString(obj.description, "description"),
    date: parseString(obj.date, "date"),
    specialist: parseString(obj.specialist, "specialist"),
    diagnosisCodes: parseDiagnosisCodes(obj),
  };

  switch (obj.type) {
    case "HealthCheck":
      return {
        ...base,
        type: "HealthCheck",
        healthCheckRating: parseHealthCheckRating(obj.healthCheckRating),
      };
    case "Hospital":
      return {
        ...base,
        type: "Hospital",
        discharge: {
          date: parseString(
            (obj.discharge as Record<string, unknown>)?.date,
            "discharge date",
          ),
          criteria: parseString(
            (obj.discharge as Record<string, unknown>)?.criteria,
            "discharge criteria",
          ),
        },
      };
    case "OccupationalHealthcare": {
      const entry: EntryWithoutId = {
        ...base,
        type: "OccupationalHealthcare",
        employerName: parseString(obj.employerName, "employerName"),
      };
      if (obj.sickLeave) {
        const sl = obj.sickLeave as Record<string, unknown>;
        entry.sickLeave = {
          startDate: parseString(sl.startDate, "sickLeave startDate"),
          endDate: parseString(sl.endDate, "sickLeave endDate"),
        };
      }
      return entry;
    }
    default:
      throw new Error(`Incorrect type: ${obj.type}`);
  }
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== "object")
    throw new Error("Incorrect or missing data");
  const obj = object as Record<string, unknown>;
  return {
    name: parseName(obj.name),
    dateOfBirth: parseDateOfBirth(obj.dateOfBirth),
    ssn: parseSsn(obj.ssn),
    gender: parseGender(obj.gender),
    occupation: parseOccupation(obj.occupation),
    entries: [],
  };
};

export default toNewPatient;
