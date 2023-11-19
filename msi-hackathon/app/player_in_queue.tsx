import React, { useState } from 'react';
import { PlayerInQueueProps } from './props';
export default function PlayerInQueue({idx,player,remove_player_from_queue,change}:PlayerInQueueProps) {
    const [new_idx,setNewIdx] = useState<string>("");
    return (
        <div key={idx}>
            <input style={{maxWidth:"1vw"}} type="text" onBlur={(e)=>{change(idx,parseInt(new_idx)-1);setNewIdx("")}} value={new_idx} onChange={(e) => setNewIdx(e.target.value)}></input>&emsp;
            {player.ID} {player.videogame.name}&emsp;
            <button onClick={() => remove_player_from_queue(idx)} style={{minWidth:"1.7vw", fontSize:"1.5vh"}}><p>X</p></button>
        </div>
    )
}