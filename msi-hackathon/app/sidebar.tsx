import React from 'react';
import AddPlayerForm from './add_player_form';
import PlayerQueue from './player_queue';
import { SidebarProps } from './props';

export default function Sidebar({add_player,available_computer,computers,queue}: SidebarProps) {
  return (
    <div>
        <AddPlayerForm add_player={add_player} available_computer={available_computer} computers={computers}/>
        <PlayerQueue queue={queue}/>
    </div>
  )
}
