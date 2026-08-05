export interface Diagnose {
  code: string
  name: string
  latin?: string
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

export enum HealthCheckRating {
  'Healthy' = 0,
  'LowRisk' = 1,
  'HighRisk' = 2,
  'CriticalRisk' = 3
}

interface BaseEntry {
  id: string
  description: string
  date: string
  specialist: string
  diagnosisCodes?: Array<Diagnose['code']>
}

interface HealthCheckEntry extends BaseEntry {
  type: 'HealthCheck'
  healthCheckRating: HealthCheckRating
}

interface OccupationalHealthCareEntry extends BaseEntry {
  type: 'OccupationalHealthcare'
  employerName: string
  sickLeave?: {
    startDate: string
    endDate: string
  }
}

interface HospitalEntry extends BaseEntry {
  type: 'Hospital'
  discharge: {
    date: string
    criteria: string
  }
}

export type Entry = HospitalEntry | OccupationalHealthCareEntry | HealthCheckEntry

type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never
export type EntryWithoutId = UnionOmit<Entry, 'id'>

export interface Patient {
  id: string
  name: string
  ssn: string
  occupation: string
  gender: Gender
  dateOfBirth: string
  entries: Entry[]
}

export type PublicPatient = Omit<Patient, 'ssn'>
export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>
export type NewPatient = Omit<Patient, 'id'> 