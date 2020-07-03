import React from 'react';
import Draggable from 'react-draggable';
import './God.css';
import { RiTimerFlashLine } from 'react-icons/ri';
import { BsMusicNote } from 'react-icons/bs';

const God = ({act, actInProgress, setActInProgress, clock, music, toggleMusic}) => {
  return (
    <Draggable
      onStart={() => setActInProgress(true)}
      onStop={() => setActInProgress(false)}
      bounds="body">
      <div className={'God '+ (actInProgress ? 'acting':'')}>
        <div className='handle'></div>
        <BsMusicNote className={'music-switch '+(music ? '':'stopped')}
          onClick={() => toggleMusic()} />
        <RiTimerFlashLine
          className={'time-switch '+(clock ? '':'stopped')}
          onClick={() => act()} />
      </div>
    </Draggable>

  );
}

export default God;
