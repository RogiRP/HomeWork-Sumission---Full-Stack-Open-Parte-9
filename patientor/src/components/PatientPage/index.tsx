import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  TextField,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  Male,
  Female,
  Transgender,
  LocalHospital,
  Work,
  Favorite,
} from "@mui/icons-material";
import axios from "axios";
import {
  Patient,
  Gender,
  Entry,
  Diagnosis,
  HealthCheckRating,
} from "../../types";
import patientService from "../../services/patients";
import { apiBaseUrl } from "../../constants";

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
  const [error, setError] = useState<string>("");
  const [type, setType] = useState<
    "HealthCheck" | "Hospital" | "OccupationalHealthcare"
  >("HealthCheck");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState("");
  // HealthCheck
  const [healthCheckRating, setHealthCheckRating] = useState("");
  // Hospital
  const [dischargeDate, setDischargeDate] = useState("");
  const [dischargeCriteria, setDischargeCriteria] = useState("");
  // OccupationalHealthcare
  const [employerName, setEmployerName] = useState("");
  const [sickLeaveStart, setSickLeaveStart] = useState("");
  const [sickLeaveEnd, setSickLeaveEnd] = useState("");

  useEffect(() => {
    if (id) {
      patientService.getById(id).then(setPatient);
    }
  }, [id]);

  if (!patient) return <div>loading...</div>;

  const buildEntryBody = () => {
    const base = {
      type,
      description,
      date,
      specialist,
      diagnosisCodes: diagnosisCodes
        ? diagnosisCodes.split(",").map((c) => c.trim())
        : [],
    };
    switch (type) {
      case "HealthCheck":
        return { ...base, healthCheckRating: Number(healthCheckRating) };
      case "Hospital":
        return {
          ...base,
          discharge: { date: dischargeDate, criteria: dischargeCriteria },
        };
      case "OccupationalHealthcare":
        return {
          ...base,
          employerName,
          ...(sickLeaveStart &&
            sickLeaveEnd && {
              sickLeave: { startDate: sickLeaveStart, endDate: sickLeaveEnd },
            }),
        };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        buildEntryBody(),
      );
      setPatient({ ...patient, entries: patient.entries.concat(data) });
      setDescription("");
      setDate("");
      setSpecialist("");
      setDiagnosisCodes("");
      setHealthCheckRating("");
      setDischargeDate("");
      setDischargeCriteria("");
      setEmployerName("");
      setSickLeaveStart("");
      setSickLeaveEnd("");
      setError("");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setError(e.response?.data || "Something went wrong");
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ marginBottom: 1 }}>
        {patient.name} <GenderIcon gender={patient.gender} />
      </Typography>
      <Typography>ssn: {patient.ssn}</Typography>
      <Typography>occupation: {patient.occupation}</Typography>

      <Box
        sx={{
          border: 1,
          borderRadius: 1,
          padding: 2,
          marginTop: 2,
          marginBottom: 2,
        }}
      >
        <Typography variant="h6">New entry</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="dense">
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              label="Type"
              onChange={(e) => setType(e.target.value as typeof type)}
            >
              <MenuItem value="HealthCheck">HealthCheck</MenuItem>
              <MenuItem value="Hospital">Hospital</MenuItem>
              <MenuItem value="OccupationalHealthcare">
                OccupationalHealthcare
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Date"
            placeholder="YYYY-MM-DD"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Specialist"
            value={specialist}
            onChange={(e) => setSpecialist(e.target.value)}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Diagnosis codes (comma separated)"
            value={diagnosisCodes}
            onChange={(e) => setDiagnosisCodes(e.target.value)}
            margin="dense"
          />

          {type === "HealthCheck" && (
            <TextField
              fullWidth
              label="Health check rating (0-3)"
              value={healthCheckRating}
              onChange={(e) => setHealthCheckRating(e.target.value)}
              margin="dense"
            />
          )}

          {type === "Hospital" && (
            <>
              <TextField
                fullWidth
                label="Discharge date"
                placeholder="YYYY-MM-DD"
                value={dischargeDate}
                onChange={(e) => setDischargeDate(e.target.value)}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Discharge criteria"
                value={dischargeCriteria}
                onChange={(e) => setDischargeCriteria(e.target.value)}
                margin="dense"
              />
            </>
          )}

          {type === "OccupationalHealthcare" && (
            <>
              <TextField
                fullWidth
                label="Employer name"
                value={employerName}
                onChange={(e) => setEmployerName(e.target.value)}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Sick leave start (optional)"
                placeholder="YYYY-MM-DD"
                value={sickLeaveStart}
                onChange={(e) => setSickLeaveStart(e.target.value)}
                margin="dense"
              />
              <TextField
                fullWidth
                label="Sick leave end (optional)"
                placeholder="YYYY-MM-DD"
                value={sickLeaveEnd}
                onChange={(e) => setSickLeaveEnd(e.target.value)}
                margin="dense"
              />
            </>
          )}

          <Button type="submit" variant="contained" sx={{ marginTop: 1 }}>
            Add
          </Button>
        </form>
      </Box>

      <Typography variant="h6" sx={{ marginBottom: 1 }}>
        entries
      </Typography>
      {patient.entries.map((entry) => (
        <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
      ))}
    </Box>
  );
};

export default PatientPage;
