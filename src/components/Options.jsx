import { RefreshCw, Volume2, VolumeOff } from "lucide-react";

// The option buttons
function Button({ children, onClick }) {
  return (
    <button className="optionButton" onClick={onClick}>
      {children}
    </button>
  );
}

// The options currently only have mute and refresh
export default function Options({ audio, onRefresh, onVolume }) {
  const audioSVG = audio ? <Volume2 /> : <VolumeOff />;
  const refreshSVG = <RefreshCw />;

  return (
    <div className="options">
      <Button onClick={onRefresh}>{refreshSVG}</Button>
      <Button onClick={onVolume}>{audioSVG}</Button>
    </div>
  );
}
