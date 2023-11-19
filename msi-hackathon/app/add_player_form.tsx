import { AddPlayerFormProps } from './props';

const videogame_list = ["Overwatch","League of Legends","Valorant"]

import React, { useState } from 'react';
export default function AddPlayerForm({add_player,available_computer,computers}:AddPlayerFormProps) {
    const [ID, setID] = useState<string>("");
    const [videogame, setVideogame] = useState<string>("Other");
    const [computer_name, setComputerName] = useState<string>(default_computer_name());
    const [errorMessage, setErrorMessage] = useState<string>("");
    function handleSubmit(e:any) {
        e.preventDefault()
        add_player(ID,videogame,computer_name_to_index(computer_name));
        e.target.reset();
    }
    function computer_name_to_index(name:string): number | null {
        if(name == "Queue") return null;
        for(let i = 0; i<computers.length; i++) {
            if(computers[i].name == name) return i;
        }
        throw Error("name does not exist")
    }
    function default_computer_name():string {
        let names = computer_names();
        if(names.length > 1) {
            return names[1]!;
        } else {
            return "Queue";
        }
    }
    function computer_names(): string[] {
        let to_return:string[] = ["Queue"];
        for(let i = 0; i<computers.length; i++) {
            if(computers[i].curr_player == null) to_return.push(computers[i].name);
        }
        return to_return
    }
    return (
        <div className='add_player_form'>
            <h1>
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
                            {computer_names().map((name) => 
                                <option value={name}>{name}</option>
                            )}
                        </select>
                    </label>
                    <input type='submit'/>
                </form>
                {/* <h2 className='errorMessage'>{errorMessage}</h2> */}
            </h1>
        </div>
    )
}