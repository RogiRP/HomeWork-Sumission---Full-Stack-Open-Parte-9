import type { DiaryEntry } from '../types'

interface DiaryListProps {
  diaries: DiaryEntry[]
}

const DiaryList = ({ diaries }: DiaryListProps) => {
  return (
    <div>
      <h2>Diary entries</h2>
      {diaries.map(diary => (
        <div key={diary.id}>
          <strong>{diary.date}</strong>
          <p>weather: {diary.weather}</p>
          <p>visibility: {diary.visibility}</p>
          <hr />
        </div>
      ))}
    </div>
  )
}

export default DiaryList