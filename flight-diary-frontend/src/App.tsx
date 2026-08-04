import { useEffect, useState } from "react";
import axios from "axios";
import DiaryList from "./components/DiaryList";
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

  return (
    <div>
      <h1>Flight Diary</h1>
      <DiaryList diaries={diaries} />
    </div>
  );
};

export default App;
