import React, { useState } from 'react';
import { PlayerQueueProps } from './props';
import PlayerInQueue from './player_in_queue';
import { Computer } from '@/types';

export default function PlayerQueue({queue,pop_player_from_queue,default_computer_name,computer_name_to_index,computer_names,remove_player_from_queue,computers,nextComputerName,setNextComputerName}:PlayerQueueProps) {
    const [computer_name, setComputerName] = useState<string|null>(null);
    function handleSubmit(e:any) {
        e.preventDefault()
        pop_player_from_queue();
        setComputerName(null);
        setNextComputerName(default_computer_name(computer_name || nextComputerName));
    }
  return (
    <div className='player_queue sub_section'>
        <div>
            <form onSubmit={handleSubmit}>
                <button onClick={handleSubmit}><p>Place Player</p></button>&ensp;
                on computer&ensp;
                <select value={computer_name || nextComputerName} onChange={(e) => setComputerName(e.target.value)}>
                    {computers.map((computer:Computer) => 
                        <option value={computer.name} hidden={computer.curr_player != null}>{computer.name}</option>
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
