import { AddPlayerFormProps } from './props';

const videogame_list = ["Overwatch","League of Legends","Valorant","Fortnite","Hearthstone","Apex Legends","Rocket League"]

import React, { useState } from 'react';
export default function AddPlayerForm({add_player,default_computer_name,computer_name_to_index,computer_names}:AddPlayerFormProps) {
    const [ID, setID] = useState<string>("");
    const [videogame, setVideogame] = useState<string>("Other");
    const [computer_name, setComputerName] = useState<string>(default_computer_name());
    const [errorMessage, setErrorMessage] = useState<string>("");
    function handleSubmit(e:any) {
        e.preventDefault()
        add_player(ID,videogame,computer_name_to_index(computer_name));
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
                        <select value={computer_name} onChange={(e) => setComputerName(e.target.value)}>
                            {computer_names().map((name:string) => 
                                <option value={name}>{name}</option>
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