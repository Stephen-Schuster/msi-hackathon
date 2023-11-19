import React from 'react';
import { PlayerQueueProps } from './props';

export default function PlayerQueue({queue}:PlayerQueueProps) {
  return (
    <div className='player_queue'>
        {queue.map((player,idx)=>
            <div key={idx}>#{idx+1} {player.ID} {player.videogame}</div>
        )}
    </div>
  )
}
