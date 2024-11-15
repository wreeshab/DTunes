import React, { useContext, useState } from "react";
import { IoMdShuffle } from "react-icons/io";
import {
  TbPlayerTrackPrevFilled,
  TbPlayerTrackNextFilled,
  TbPlayerPauseFilled,
} from "react-icons/tb";
import { FaPlay } from "react-icons/fa";
import { ImLoop } from "react-icons/im";
import { HiMiniSpeakerWave, HiOutlineQueueList } from "react-icons/hi2";
import { MdLyrics } from "react-icons/md";
import { PlayerContext } from "../context/PlayerContext";
import { FaCompactDisc } from "react-icons/fa";

import Queue from "./Queue";
import Lyrics from "./lyrics/Lyrics";

const TrackBar = () => {
  const {
    seekBar,
    seekBackground,
    playerStatus,
    pause,
    play,
    songDetails,
    time,
    seek,
    goToDjBeatDrop,
    playNext,
    playPrevious,
    shuffleQueue,
  } = useContext(PlayerContext);
  const [showQueue, setShowQueue] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  return (
    <div className="pt-2 h-[10%] border-t-2 border-black  bg-black text-white flex justify-between items-center px-4 ">
      <div className="hidden lg:flex items-center gap-5 ">
        <img src={songDetails.image} className="h-[50px] w-[50px] bg-black" />
        <div>
          <p className="font-bold text-xl">{songDetails.name}</p>
          <p>{songDetails.artist}</p>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 m-auto">
        <div className="flex gap-6 ">
          <IoMdShuffle className="text-2xl" onClick={shuffleQueue} />
          <TbPlayerTrackPrevFilled
            onClick={playPrevious}
            className="text-2xl"
          />
          {playerStatus ? (
            <TbPlayerPauseFilled onClick={pause} className="text-2xl" />
          ) : (
            <FaPlay onClick={play} className="text-2xl" />
          )}
          <TbPlayerTrackNextFilled onClick={playNext} className="text-2xl" />
          <ImLoop className="text-2xl" />
        </div>
        <div className="flex items-center gap-5">
          <p>{`${time.currentTime.minutes}:${time.currentTime.seconds
            .toString()
            .padStart(2, "0")}`}</p>
          <div
            ref={seekBackground}
            className="w-[60vw] max-w-[500px] bg-white rounded-full cursor-pointer"
            onClick={seek}
          >
            <hr
              ref={seekBar}
              className="h-1 border-none bg-green-700 rounded-full"
              style={{ width: "0%" }}
            />
          </div>
          <p>{`${time.duration.minutes}:${time.duration.seconds
            .toString()
            .padStart(2, "0")}`}</p>
        </div>
      </div>
      <div className="hidden lg:flex items-center gap-4 opacity-80 mr-10">
        <FaCompactDisc
          onClick={() => goToDjBeatDrop()}
          className="text-2xl cursor-pointer"
        />
        <MdLyrics
          className="text-2xl cursor-pointer"
          onClick={() => setShowLyrics(true)}
        />{" "}
        <HiOutlineQueueList
          className="text-2xl cursor-pointer"
          onClick={() => setShowQueue(true)}
        />
      </div>
      {showQueue && <Queue closeQueue={() => setShowQueue(false)} />}
      {showLyrics && <Lyrics closeLyrics={() => setShowLyrics(false)} />}{" "}
    </div>
  );
};

export default TrackBar;
