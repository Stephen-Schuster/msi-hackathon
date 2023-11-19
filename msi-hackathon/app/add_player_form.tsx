import { Computer } from '@/types';
import { AddPlayerFormProps } from './props';

const videogame_list = ["Overwatch","League of Legends","Valorant","Fortnite","Hearthstone","Apex Legends","Rocket League"]

import React, { useState } from 'react';
export default function AddPlayerForm({add_player,default_computer_name,computer_name_to_index,computers,nextComputerName,setNextComputerName}:AddPlayerFormProps) {
    const [ID, setID] = useState<string>("");
    const [videogame, setVideogame] = useState<string>("Other");
    const [computer_name, setComputerName] = useState<string|null>(null);
    const [errorMessage, setErrorMessage] = useState<string>("");
    function handleSubmit(e:any) {
        e.preventDefault()
        add_player(ID,videogame,computer_name_to_index(computer_name || nextComputerName));
        setComputerName(null);
        setNextComputerName(default_computer_name(computer_name || nextComputerName));
        setVideogame("Other");
        setID("");
    }
    return (
        <div className='add_player_form sub_section'>
            <div>
                Add Player
                <form onSubmit={handleSubmit}>
                    <label>PID:<br/>
                        <input type="text" value={ID} onChange={(e) => setID(e.target.value)}/>
                    </label><br/>
                    <label>Game:<br/>
                        <select value={videogame} onChange={(e) => setVideogame(e.target.value)}>
                            {videogame_list.map((vg) => 
                                <option value={vg}>{vg}</option>
                            )}
                            <option value={"Other"}>Other</option>
                        </select>
                    </label><br/>
                    <label>Computer:<br/>
                        <select value={computer_name || nextComputerName} onChange={(e) => setComputerName(e.target.value)}>
                            <option value={"Queue"}>{"Queue"}</option>
                            {computers.map((computer:Computer) => 
                                <option value={computer.name} hidden={computer.curr_player != null}>{computer.name}</option>
                            )}
                        </select>
                    </label><br/>
                    <button onClick={handleSubmit}><p>Add Player</p></button>
                </form>
                {/* <h2 className='errorMessage'>{errorMessage}</h2> */}
            </div>
        </div>
    )
}