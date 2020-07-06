import React from 'react';
import Draggable from 'react-draggable';
import './God.css';
import { RiTimerFlashLine } from 'react-icons/ri';
import { BsMusicNote } from 'react-icons/bs';
import { GiBackwardTime } from 'react-icons/gi';
import { MdMenu } from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { TiArrowMoveOutline } from 'react-icons/ti';
import { GiCorporal } from 'react-icons/gi';
import { GiPerspectiveDiceSixFacesFour } from 'react-icons/gi';
import { GiRollingDices } from 'react-icons/gi';
import { GiMusicalNotes } from 'react-icons/gi';


const God = ({act, actInProgress, setActInProgress, clock, music, toggleMusic, restart}) => {
  return (
    <Draggable
      onStart={() => setActInProgress(true)}
      onStop={() => setActInProgress(false)}
      bounds="body">
      <div className={'God '+ (actInProgress ? 'acting':'')}>
        <div className='handle-container'>
          <TiArrowMoveOutline className={'smaller grab-cursor handle-switch'} />
        </div>
        {/*
        <div className={'menu-container'}>
          <MdMenu className={'menu-switch'}
            onClick={() => restart()}
            onTouchStart={() => restart()} />
        </div>
        */}
        <div className={'switch-container'}>
          <GiBackwardTime className={'smaller refresh-switch'}
            onClick={() => restart()}
            onTouchStart={() => restart()} />
        </div>
        <div className={'switch-container'}>
          <GiRollingDices className={'random-switch'}
            onClick={() => restart(true)}
            onTouchStart={() => restart(true)} />
        </div>
        <div className={'switch-container'}>
          <GiMusicalNotes className={'smaller music-switch '+(music ? '':'stopped')}
            onClick={() => toggleMusic()}
            onTouchStart={() => toggleMusic()} />
        </div>
        <div className={'switch-container'}>
          <RiTimerFlashLine
            className={'time-switch '+(clock ? '':'stopped')}
            onClick={() => act()}
            onTouchStart={() => act()} />
        </div>
      </div>
    </Draggable>

  );
}

export default God;
