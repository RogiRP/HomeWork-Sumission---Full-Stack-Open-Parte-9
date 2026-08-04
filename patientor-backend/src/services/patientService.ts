import { v1 as uuid } from 'uuid'
import patientData from '../../data/patients'
import { Patient, PublicPatient, NewPatient } from '../types'

const patients: Patient[] = patientData as Patient[]

const getAll = (): PublicPatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }))
}

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = { id: uuid(), ...patient }
  patients.push(newPatient)
  return newPatient
}

export default { getAll, addPatient }