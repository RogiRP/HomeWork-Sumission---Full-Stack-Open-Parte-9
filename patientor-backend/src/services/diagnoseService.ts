import diagnoseData from '../../data/diagnoses'
import { Diagnose } from '../types'

const diagnoses: Diagnose[] = diagnoseData

const getAll = (): Diagnose[] => {
  return diagnoses
}

export default { getAll }