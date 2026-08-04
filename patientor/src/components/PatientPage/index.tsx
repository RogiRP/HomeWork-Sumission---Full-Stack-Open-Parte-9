import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import { Male, Female, Transgender } from "@mui/icons-material";
import { Patient, Gender } from "../../types";
import patientService from "../../services/patients";

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

const PatientPage = () => {
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
      <Typography>date of birth: {patient.dateOfBirth}</Typography>
      <Typography variant="h6" sx={{ marginTop: 2 }}>
        entries
      </Typography>
      {patient.entries.length === 0 && <Typography>No entries</Typography>}
    </Box>
  );
};

export default PatientPage;
