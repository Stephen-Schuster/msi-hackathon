import React from 'react';
import AddPlayerForm from './add_player_form';
import PlayerQueue from './player_queue';
import { SidebarProps } from './props';

export default function Sidebar({add_player,queue,pop_player_from_queue,default_computer_name,computer_name_to_index,computer_names,remove_player_from_queue,computers,nextComputerName,setNextComputerName,videogame_list,setQueue}: SidebarProps) {

  return (
    <div>
        <AddPlayerForm add_player={add_player} default_computer_name={default_computer_name} computer_name_to_index={computer_name_to_index} computers={computers} setNextComputerName={setNextComputerName} nextComputerName={nextComputerName} videogame_list={videogame_list}/>
        {
            queue.length == 0?<></>:
            <PlayerQueue computers={computers} queue={queue} pop_player_from_queue={pop_player_from_queue} default_computer_name={default_computer_name} computer_name_to_index={computer_name_to_index} computer_names={computer_names} remove_player_from_queue={remove_player_from_queue} setNextComputerName={setNextComputerName} nextComputerName={nextComputerName} setQueue={setQueue}/>
        }
    </div>
  )
}
