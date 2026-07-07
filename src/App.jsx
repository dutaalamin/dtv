import { useState, useRef, useEffect } from 'react';
import defaultSongs from './songs.json';

// Lucide React Icons as SVG
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
const PauseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>;
const SkipForwardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>;
const SkipBackIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>;
const ShuffleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>;
const MusicIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>;

function App() {
  const [songs, setSongs] = useState(defaultSongs);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTimeStr, setCurrentTimeStr] = useState("0:00");
  const [durationStr, setDurationStr] = useState("-:-");

  const formatTime = (time) => {
    if (isNaN(time)) return "-:-";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const audioRef = useRef(null);
  
  const currentSong = songs[currentSongIndex] || null;

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => {
        console.error("Playback failed:", e);
        setIsPlaying(false);
      });
    }
  }, [currentSongIndex]);

  const togglePlay = () => {
    if (!currentSong) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => {
        console.error("Playback failed:", e);
        alert("File musik tidak ditemukan atau browser memblokir pemutaran. Pastikan file ada di folder public/music/");
      });
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const duration = audioRef.current.duration;
    const currentTime = audioRef.current.currentTime;
    if (duration) {
      setProgress((currentTime / duration) * 100);
      setCurrentTimeStr(formatTime(currentTime));
      setDurationStr(formatTime(duration));
    }
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDurationStr(formatTime(audioRef.current.duration));
  };

  const handleProgressBarClick = (e) => {
    if (!audioRef.current || !currentSong) return;
    
    const container = e.currentTarget;
    const clickX = e.clientX - container.getBoundingClientRect().left;
    const newProgress = (clickX / container.clientWidth) * 100;
    
    const newTime = (newProgress / 100) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setProgress(newProgress);
  };

  const handleNext = () => {
    if (songs.length === 0) return;
    
    let nextIndex;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * songs.length);
      while (nextIndex === currentSongIndex && songs.length > 1) {
        nextIndex = Math.floor(Math.random() * songs.length);
      }
    } else {
      nextIndex = (currentSongIndex + 1) % songs.length;
    }

    if (nextIndex === currentSongIndex) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.error(e));
        if (!isPlaying) setIsPlaying(true);
      }
    } else {
      setCurrentSongIndex(nextIndex);
    }
  };

  const handlePrev = () => {
    if (songs.length === 0) return;
    setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
  };

  const handleEnded = () => {
    handleNext();
  };



  return (
    <div className="player-app">
      <div className="app-header">
        <h1>Vibe Player</h1>
      </div>

      <div className="song-info">
        <div className={`song-cover ${isPlaying ? 'playing' : ''}`}>
          <MusicIcon />
        </div>
        <div className="song-title">
          {currentSong ? currentSong.title : "Pilih Lagu"}
        </div>
        <div className="song-artist">
          {currentSong ? currentSong.artist : "-"}
        </div>
      </div>

      <div className="controls-container">
        <div className="progress-bar-container">
          <span className="time">{currentTimeStr}</span>
          <div className="progress-bar" onClick={handleProgressBarClick}>
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="time">{durationStr}</span>
        </div>

        <div className="buttons">
          <button 
            className={`btn ${isShuffle ? 'active' : ''}`} 
            onClick={() => setIsShuffle(!isShuffle)}
            title="Shuffle"
          >
            <ShuffleIcon />
          </button>
          
          <button className="btn" onClick={handlePrev} title="Previous">
            <SkipBackIcon />
          </button>
          
          <button 
            className={`btn btn-play ${isPlaying ? 'is-playing' : ''}`} 
            onClick={togglePlay}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          
          <button className="btn" onClick={handleNext} title="Next">
            <SkipForwardIcon />
          </button>
        </div>
      </div>

      <div className="song-list-container">
        {songs.map((song, index) => (
          <div 
            key={song.id} 
            className={`song-item ${index === currentSongIndex ? 'active' : ''}`}
            onClick={() => {
              setCurrentSongIndex(index);
              if (!isPlaying) setIsPlaying(true);
            }}
          >
            <div className="song-item-icon">
              <MusicIcon />
            </div>
            <div className="song-item-info">
              <div className="song-item-title">{song.title}</div>
              <div className="song-item-artist">{song.artist}</div>
            </div>
          </div>
        ))}


      </div>

      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
      )}
    </div>
  );
}

export default App;
