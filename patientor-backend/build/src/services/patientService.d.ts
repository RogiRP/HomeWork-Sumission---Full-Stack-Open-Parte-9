import { Patient, PublicPatient, NewPatient } from '../types';
declare const _default: {
    getAll: () => PublicPatient[];
    addPatient: (patient: NewPatient) => Patient;
};
export default _default;
