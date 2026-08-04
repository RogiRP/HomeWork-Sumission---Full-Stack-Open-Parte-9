import { useEffect, useState } from "react";
import axios from "axios";
import DiaryList from "./components/DiaryList";
import DiaryForm from "./components/DiaryForm";
import type { DiaryEntry } from "./types";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    axios
      .get<DiaryEntry[]>("http://localhost:3000/api/diaries")
      .then((response) => {
        setDiaries(response.data);
      });
  }, []);

  const addDiary = (entry: DiaryEntry) => {
    setDiaries(diaries.concat(entry));
  };

  return (
    <div>
      <h1>Flight Diary</h1>
      <DiaryForm onAdd={addDiary} />
      <DiaryList diaries={diaries} />
    </div>
  );
};

export default App;
