import { Computer } from '@/types';
import requeue from '../images/return.png';
import remove from '../images/close.png';
import React, { useState } from 'react';
import computer_icon from '../images/computer.png';
import { ComputerIconProps } from './props';
const MINIMUM_TIME = 3600_000;
export default function ComputerIcon({index, computer,remove_player_from_computer,move_player_from_computer_to_queue}:ComputerIconProps) {
    const [hovering, setHovering] = useState<boolean>(false);
    const [timeElapsed, setTimeElapsed] = useState<number>(0); // in milliseconds
    function updateTimeLeft() {
        if(computer.curr_player == null) {
            setTimeElapsed(0);
        } else {
            setTimeElapsed(new Date().getTime()-computer.curr_player!.play_start_time!);
        }
    }
    setInterval(updateTimeLeft,1000);
    function secondsToTimerString(ms:number):string {
        let hours = (ms/3600_000).toFixed(0);
        ms %= 3600_000
        let minutes = (ms/60_000).toFixed(0);
        ms %= 60_000
        let seconds = (ms/1000).toFixed(0);
        while(minutes.length < 2) minutes = "0"+minutes;
        while(seconds.length < 2) seconds = "0"+seconds;
        let to_return = hours+":"+minutes+":"+seconds;
        return to_return
    }
    return (
        <div onMouseOver={()=>setHovering(true)} onMouseOut={()=>setHovering(false)}>
            <img src={computer_icon.src} alt="computer" className='computer' style={{left:computer.x+"%",top:computer.y+"%"}}></img>
            <div className='computer_name_container' style={{left:computer.x+"%",top:computer.y+"%"}}>
                <h1 className='computer_name'>{computer.name}</h1>
            </div>
            {
                computer.curr_player == null?<></>:
                <>
                    <div className='computer_player_info_container' style={{backgroundColor:'hsl('+(120/MINIMUM_TIME*(MINIMUM_TIME-Math.min(timeElapsed,MINIMUM_TIME)))+',70%,50%)',left:computer.x+"%",top:computer.y+"%"}}>
                        <h2 className='computer_player_info'>
                            {computer.curr_player!.ID}<br/>
                            {secondsToTimerString(timeElapsed)}
                        </h2>
                    </div>
                    {
                        hovering?
                        <>
                            <button className='remove' style={{left:computer.x+"%",top:computer.y+"%"}} onClick={() => remove_player_from_computer(index)}>
                                <img src={remove.src}></img>
                            </button>
                            <button className='requeue' style={{left:computer.x+"%",top:computer.y+"%"}} onClick={() => move_player_from_computer_to_queue(index)}>
                                <img src={requeue.src}></img>
                            </button>
                        </>:<></>
                    }
                </>
            }
        </div>
    )
}