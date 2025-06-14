import CircularProgress from '@mui/material/CircularProgress';

export default function GeneratingProgress({ progress, text }: { progress: number; text: string; }) {

    return (
      <div className="generating-progress">
        <div className="circular-progress">
          <CircularProgress
            variant="determinate"
            value={progress}
            size={247}
            thickness={3}
            style={{ color: '#385AC9' }}
          />
          <div className="progress-text">{`${progress}%`}</div>
        </div>
        <h2>{text}</h2>
      </div>
    );
}