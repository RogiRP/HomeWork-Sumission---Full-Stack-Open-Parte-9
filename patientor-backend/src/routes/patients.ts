import express from 'express'
import patientService from '../services/patientService'
import { NewPatient } from '../types'

const router = express.Router()

router.get('/', (_req, res) => {
  res.json(patientService.getAll())
})

router.post('/', (req, res) => {
  const { name, dateOfBirth, ssn, gender, occupation } = req.body as NewPatient
  const newPatient = patientService.addPatient({ name, dateOfBirth, ssn, gender, occupation })
  res.json(newPatient)
})

export default router