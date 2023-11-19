import React, { useState } from 'react';
import { PlayerQueueProps } from './props';
import PlayerInQueue from './player_in_queue';

export default function PlayerQueue({queue,pop_player_from_queue,default_computer_name,computer_name_to_index,computer_names,remove_player_from_queue}:PlayerQueueProps) {
    const [computer_name, setComputerName] = useState<string>(default_computer_name());
    function handleSubmit(e:any) {
        e.preventDefault()
        pop_player_from_queue();
    }
  return (
    <div className='player_queue sub_section'>
        <div>
            <form onSubmit={handleSubmit}>
                <button onClick={handleSubmit}><p>Place Player</p></button>
                on computer 
                <select value={computer_name} onChange={(e) => setComputerName(e.target.value)}>
                    {computer_names().slice(1).map((name:string) => 
                        <option value={name}>{name}</option>
                    )}
                </select>
            </form>
            {queue.map((player,idx)=>
                <PlayerInQueue player={player} idx={idx} remove_player_from_queue={remove_player_from_queue}/>
            )}
        </div>
    </div>
  )
}
