import { useState } from "react";
import axios from "axios";
import type { DiaryEntry } from "../types";

interface DiaryFormProps {
  onAdd: (entry: DiaryEntry) => void;
}

const weatherOptions = ["sunny", "rainy", "cloudy", "stormy", "windy"];
const visibilityOptions = ["great", "good", "ok", "poor"];

const DiaryForm = ({ onAdd }: DiaryFormProps) => {
  const [date, setDate] = useState("");
  const [weather, setWeather] = useState("");
  const [visibility, setVisibility] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post<DiaryEntry>("http://localhost:3000/api/diaries", {
        date,
        weather,
        visibility,
        comment,
      })
      .then((response) => {
        onAdd(response.data);
        setDate("");
        setWeather("");
        setVisibility("");
        setComment("");
        setError("");
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data || "Something went wrong");
        }
      });
  };

  return (
    <div>
      <h2>Add new entry</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          date{" "}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          weather &nbsp;
          {weatherOptions.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="weather"
                value={option}
                checked={weather === option}
                onChange={(e) => setWeather(e.target.value)}
              />
              {option} &nbsp;
            </label>
          ))}
        </div>
        <div>
          visibility &nbsp;
          {visibilityOptions.map((option) => (
            <label key={option}>
              <input
                type="radio"
                name="visibility"
                value={option}
                checked={visibility === option}
                onChange={(e) => setVisibility(e.target.value)}
              />
              {option} &nbsp;
            </label>
          ))}
        </div>
        <div>
          comment{" "}
          <input value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  );
};

export default DiaryForm;
