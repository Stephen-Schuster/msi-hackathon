import React, { useState } from 'react';
import { PlayerInQueueProps } from './props';
export default function PlayerInQueue({idx,player,remove_player_from_queue}:PlayerInQueueProps) {
    return (
        <div key={idx}>
            #{idx+1} {player.ID} {player.videogame.name}&emsp;
            <button onClick={() => remove_player_from_queue(idx)} style={{minWidth:"1.7vw", fontSize:"1.5vh"}}><p>X</p></button>
        </div>
    )
}