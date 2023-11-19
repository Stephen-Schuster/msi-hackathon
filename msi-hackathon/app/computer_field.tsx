import layout from '../images/tec_layout.png';
import React, { useState } from 'react';
import ComputerIcon from './computer_icon';
import { Computer } from '@/types';
import { ComputerFieldProps } from './props';
export default function ComputerField({computers,remove_player_from_computer,move_player_from_computer_to_queue,make_alert,minimum_time}:ComputerFieldProps) {
    return (
        <div className='computer_field'>
            <img src={layout.src} alt="layout" style={{borderRadius:"20px"}}></img>
            {computers.map((computer,idx) => 
              <ComputerIcon index={idx} computer={computer} remove_player_from_computer={remove_player_from_computer} move_player_from_computer_to_queue={move_player_from_computer_to_queue}  make_alert={make_alert} minimum_time={minimum_time}/>
            )}
        </div>
    )
}