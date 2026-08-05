import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import {
  Male,
  Female,
  Transgender,
  LocalHospital,
  Work,
  Favorite,
} from "@mui/icons-material";
import {
  Patient,
  Gender,
  Entry,
  Diagnosis,
  HealthCheckRating,
} from "../../types";
import patientService from "../../services/patients";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`,
  );
};

const GenderIcon = ({ gender }: { gender: Gender }) => {
  switch (gender) {
    case Gender.Male:
      return <Male />;
    case Gender.Female:
      return <Female />;
    default:
      return <Transgender />;
  }
};

const HealthRatingIcon = ({ rating }: { rating: HealthCheckRating }) => {
  const colors = {
    [HealthCheckRating.Healthy]: "green",
    [HealthCheckRating.LowRisk]: "yellow",
    [HealthCheckRating.HighRisk]: "orange",
    [HealthCheckRating.CriticalRisk]: "red",
  };
  return <Favorite sx={{ color: colors[rating] }} />;
};

const DiagnosisList = ({
  codes,
  diagnoses,
}: {
  codes?: string[];
  diagnoses: Diagnosis[];
}) => {
  if (!codes || codes.length === 0) return null;
  return (
    <ul>
      {codes.map((code) => {
        const diagnosis = diagnoses.find((d) => d.code === code);
        return (
          <li key={code}>
            {code} {diagnosis?.name}
          </li>
        );
      })}
    </ul>
  );
};

const EntryDetails = ({
  entry,
  diagnoses,
}: {
  entry: Entry;
  diagnoses: Diagnosis[];
}) => {
  switch (entry.type) {
    case "Hospital":
      return (
        <Box sx={{ border: 1, borderRadius: 1, padding: 1, marginBottom: 1 }}>
          <Typography>
            {entry.date} <LocalHospital />
          </Typography>
          <Typography>
            <em>{entry.description}</em>
          </Typography>
          <Typography>
            Discharge: {entry.discharge.date} — {entry.discharge.criteria}
          </Typography>
          <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
        </Box>
      );
    case "OccupationalHealthcare":
      return (
        <Box sx={{ border: 1, borderRadius: 1, padding: 1, marginBottom: 1 }}>
          <Typography>
            {entry.date} <Work /> <em>{entry.employerName}</em>
          </Typography>
          <Typography>
            <em>{entry.description}</em>
          </Typography>
          {entry.sickLeave && (
            <Typography>
              Sick leave: {entry.sickLeave.startDate} —{" "}
              {entry.sickLeave.endDate}
            </Typography>
          )}
          <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
        </Box>
      );
    case "HealthCheck":
      return (
        <Box sx={{ border: 1, borderRadius: 1, padding: 1, marginBottom: 1 }}>
          <Typography>
            {entry.date} <Favorite />
          </Typography>
          <Typography>
            <em>{entry.description}</em>
          </Typography>
          <HealthRatingIcon rating={entry.healthCheckRating} />
          <DiagnosisList codes={entry.diagnosisCodes} diagnoses={diagnoses} />
        </Box>
      );
    default:
      return assertNever(entry);
  }
};

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (id) {
      patientService.getById(id).then(setPatient);
    }
  }, [id]);

  if (!patient) return <div>loading...</div>;

  return (
    <Box>
      <Typography variant="h4" sx={{ marginBottom: 1 }}>
        {patient.name} <GenderIcon gender={patient.gender} />
      </Typography>
      <Typography>ssn: {patient.ssn}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>
      <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 1 }}>
        entries
      </Typography>
      {patient.entries.map((entry) => (
        <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
    </Box>
  );
};

export default PatientPage;
