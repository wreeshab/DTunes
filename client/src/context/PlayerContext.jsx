import { createContext, useRef, useState, useEffect, useContext } from "react";
import { SocketContext } from "./SocketContext";
import { AuthContext } from "./AuthContext";

const PlayerContext = createContext();

const PlayerContextProvider = ({ children }) => {
  const audioRef = useRef();
  const seekBackground = useRef();
  const seekBar = useRef();
  const { socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  const [track, setTrack] = useState();
  const [playerStatus, setPlayerStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: { minutes: 0, seconds: 0 },
    duration: { minutes: 0, seconds: 0 },
  });
  const [songDetails, setSongDetails] = useState({
    name: "",
    artist: "",
    image: "",
  });
  const [queue, setQueue] = useState([]);

  const addToQueue = (songs) =>
    setQueue((prevQueue) => [...prevQueue, ...songs]);
  const clearQueue = () => setQueue([]);

  useEffect(() => {
    if (socket) {
      socket.emit("join-room", user.id);
      socket.on("play", handlePlay);
      socket.on("pause", handlePause);
      socket.on("seek", handleSeek);
      socket.on("track-change", handleTrackChange);

      return () => {
        socket.emit("leave-room", user.id);
        socket.off("play", handlePlay);
        socket.off("pause", handlePause);
        socket.off("seek", handleSeek);
        socket.off("track-change", handleTrackChange);
      };
    }
  }, [socket]);

  const handlePlay = () => play();
  const handlePause = () => pause();
  const handleSeek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };
  const handleTrackChange = ({ audioUrl,songDetails }) => {
    setTrackAndPlay(audioUrl,songDetails );
  };

  useEffect(() => {
    const updateCurrentTime = () => {
      if (audioRef.current) {
        const currentTime = Math.floor(audioRef.current.currentTime);
        const duration = Math.floor(audioRef.current.duration);

        setTime({
          currentTime: {
            minutes: Math.floor(currentTime / 60),
            seconds: currentTime % 60,
          },
          duration: {
            minutes: Math.floor(duration / 60),
            seconds: duration % 60,
          },
        });

        if (seekBar.current && audioRef.current.duration) {
          const progressPercent =
            (audioRef.current.currentTime / audioRef.current.duration) * 100;
          seekBar.current.style.width = `${progressPercent}%`;
        }
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", updateCurrentTime);
      audioRef.current.addEventListener("loadedmetadata", updateCurrentTime);
      audioRef.current.addEventListener("ended", handleSongEnd);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", updateCurrentTime);
        audioRef.current.removeEventListener(
          "loadedmetadata",
          updateCurrentTime
        );
        audioRef.current.removeEventListener("ended", handleSongEnd);
      }
    };
  }, [track, queue]);

  const play = () => {
    audioRef.current.play();
    setPlayerStatus(true);
    if (user && socket) {
      socket.emit("play", user.id);
    }
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayerStatus(false);
    if (user && socket) {
      socket.emit("pause", user.id);
    }
  };

  useEffect(() => {
    if (user && songDetails && socket) {
      socket.emit("start-playing", {
        userId: user.id,
        songDetails,
      });
    }
  }, [user, songDetails, socket]);

  const setTrackAndPlay = (audioUrl, songDetails) => {
    setTrack(audioUrl);
    setSongDetails(songDetails);
    // i have no idea why without the timeout its not working, probably there's some delay in the audio loading.
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        play();
      }
      if (user && socket) {
        socket.emit("track-change", { userId: user.id, audioUrl, songDetails });
      }
    }, 25);
  };

  const seek = (e) => {
    if (audioRef.current) {
      const rect = seekBackground.current.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const seekTime = (offsetX / rect.width) * audioRef.current.duration;
      audioRef.current.currentTime = seekTime;

      if (user && socket) {
        socket.emit("seek", user.id, seekTime);
      }
    }
  };

  const handleSongEnd = () => {
    if (queue.length > 0) {
      const newQueue = queue.slice(1);
      setQueue(newQueue);

      if (newQueue.length > 0) {
        setSongDetails({
          name: newQueue[0].name,
          artist: newQueue[0].artist.name,
          image: newQueue[0].thumbnailUrl,
        });
        setTrackAndPlay(newQueue[0].audioUrl, {
          name: newQueue[0].name,
          artist: newQueue[0].artist.name,
          image: newQueue[0].thumbnailUrl,
        });
      } else {
        setTrack(null);
        setPlayerStatus(false);
      }
    }
  };

  const contextValue = {
    audioRef,
    seekBackground,
    seekBar,
    seek,
    track,
    setTrackAndPlay,
    playerStatus,
    setPlayerStatus,
    time,
    setTime,
    play,
    pause,
    songDetails,
    setSongDetails,
    queue,
    setQueue,
    addToQueue,
    clearQueue,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
export { PlayerContext };
