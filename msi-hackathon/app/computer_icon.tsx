import { Computer } from '@/types';
import requeue from '../images/return.png';
import remove from '../images/close.png';
import React, { useState } from 'react';
import computer_icon from '../images/computer.png';
import { ComputerIconProps } from './props';
import get_time, { MULTIPLIER } from './get_time';
import person from '../images/music-lover.png';
export default function ComputerIcon({index, computer,remove_player_from_computer,move_player_from_computer_to_queue,make_alert,minimum_time}:ComputerIconProps) {
    const [hovering, setHovering] = useState<boolean>(false);
    const [timeElapsed, setTimeElapsed] = useState<number>(0); // in milliseconds
    function updateTimeLeft() {
        if(computer.curr_player == null) {
            setTimeElapsed(0);
        } else {
            setTimeElapsed(get_time()-computer.curr_player!.play_start_time!);
        }
    }
    setInterval(updateTimeLeft,1000/MULTIPLIER);
    function secondsToTimerString(ms:number):string {
        let hours = (Math.max(0,ms/3600_000-0.5)).toFixed(0);
        ms %= 3600_000
        let minutes = (Math.max(0,ms/60_000-0.5)).toFixed(0);
        ms %= 60_000
        let seconds = (Math.max(0,ms/1000-0.5)).toFixed(0);
        while(minutes.length < 2) minutes = "0"+minutes;
        while(seconds.length < 2) seconds = "0"+seconds;
        let to_return = hours+":"+minutes+":"+seconds;
        return to_return
    }
    return (
        <div onMouseOver={()=>setHovering(true)} onMouseOut={()=>setHovering(false)}>
            <img src={computer_icon.src} alt="computer" className='computer' style={{left:computer.x/10+"%",top:computer.y/10+"%"}}></img>
            <div className='computer_name_container' style={{left:computer.x/10+"%",top:computer.y/10+"%"}}>
                <h1 className='computer_name'>{computer.name}</h1>
            </div>
            {
                computer.curr_player == null?<></>:
                <>
                    <div className='computer_player_info_container' style={{backgroundColor:'hsl('+(120/minimum_time*(minimum_time-Math.min(timeElapsed,minimum_time)))+',70%,50%)',left:computer.x/10+"%",top:computer.y/10+"%"}}>
                        <h2 className='computer_player_info'>
                            {computer.curr_player!.ID}<br/>
                            {secondsToTimerString(timeElapsed)}
                        </h2>
                    </div>
                    {
                        hovering?
                        <>
                            <button className='remove' style={{left:computer.x/10+"%",top:computer.y/10+"%"}} onClick={() => remove_player_from_computer(index)}>
                                <img src={remove.src}></img>
                            </button>
                            <button className='requeue' style={{left:computer.x/10+"%",top:computer.y/10+"%"}} onClick={() => move_player_from_computer_to_queue(index)}>
                                <img src={requeue.src}></img>
                            </button>
                        </>:<></>
                    }
                </>
            }
        </div>
    )
}