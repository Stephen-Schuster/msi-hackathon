"use client";
import React, { useState } from 'react';
import Sidebar from './sidebar';
import { Computer, Player, question, videogame } from '@/types';
import ComputerField from './computer_field';
import CustomQuestionDialog from './custom_question';
import get_time, { MULTIPLIER } from './get_time';
import gear_icon from '../images/settings.png';
import logs_icon from '../images/logs.png';
import monitor_icon from '../images/monitor.png';

const NUM_COMPUTERS = 24;

export default function Home() {

  const [computers, setComputers] = useState<Computer[]>(default_computer_list());
  const [next_computer_name, setNextComputerName] = useState<string>(default_computer_name());
  const [queue, setQueue] = useState<Player[]>([]);
  const [questions,setQuestions] = useState<question[]>([]);
  const [minimum_time, setMinimumTime] = useState<number>(3600_000);
  const [snoozeTime, setSnoozeTime] = useState<number>(60_000);
  const [videogame_list, setVideogameList] = useState<videogame[]>([
    {name: "Overwatch", leadout_time:10*60_000},
    {name: "League of Legends", leadout_time:20*60_000},
    {name: "Valorant", leadout_time:17*60_000},
    {name: "Fortnite", leadout_time:10*60_000},
    {name: "Hearthstone", leadout_time:4*60_000},
    {name: "Apex Legends", leadout_time:8*60_000},
    {name: "Rocket League", leadout_time:15*60_000},
    {name: "Other", leadout_time:10*60_000}
  ]);
  const [questionFadingOut, setQuestionFadingOut] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [layoutBG,setLayoutBG] = useState<string|null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  function default_computer_list(): Computer[] {
    let computers = [];
    for (let i = 0; i < NUM_COMPUTERS; i++) {
      let name = String.fromCharCode(65 + Math.floor(i/5))+(i%5+1);
      let x = 1000.0/8 * (i%5+1);
      let y = 1000 - 1000.0/5 * (Math.floor(i/5)+1);
      if(i>=20) {
        x = 1000.0*7/8;
        y = 1000.0/5 * (i-19);
      }
      computers.push({
        curr_player: null,
        name,
        x,
        y,
      })
    }
    return computers;
  }


  function force_add_player(to_add: Player, computer_number: number) {
      to_add.play_start_time = get_time();
      let new_computers = computers.slice();
      new_computers[computer_number].curr_player = to_add;
      setComputers(new_computers);
  }

  function add_player(ID: string, videogame_name: string="Other", computer_number: number | null = null) {
    let videogame = null;
    for(let i = 0;i<videogame_list.length; i++) {
      if(videogame_list[i].name == videogame_name) {
        videogame = videogame_list[i];
        break;
      }
    }
    let to_add: Player = {
      play_start_time: null,
      queue_start_time: get_time(),
      computer_number: computer_number,
      videogame: videogame!,
      ID: ID,
    };
    if (computer_number != null) {
      addLog("Player "+ID+" playing "+videogame_name+" added to computer "+computers[computer_number].name.toString());
      if (computers[computer_number].curr_player == null) {
        force_add_player(to_add,computer_number)
      } else {
        add_question({
          message: "Someone is already playing on Computer " +
          computers[computer_number].name +
          ". Are you sure you want to kick off the current player?",
          options: ['Yes','No'],
          callbacks: [()=>force_add_player(to_add,computer_number),()=>{}]
        });
      }
    } else {
      addLog("Player "+ID+" playing "+videogame_name+" added to queue");
      console.log(to_add);
      let new_queue = queue.slice();
      new_queue.push(to_add);
      setQueue(new_queue);
      check_queue_alert()
    }
  }
  function move_player_from_computer_to_queue(computer_number: number) {
    if (computers[computer_number].curr_player == null) {
      throw Error("No Player there!");
    } else {
      if(queue.length > 0) {
        add_question({
          message: "Place Player "+queue[0].ID+" on computer "+computers[computer_number].name+"?",
          options: ["Yes","No"],
          callbacks: [() =>{
            let new_computers = computers.slice();
            let new_queue = queue.slice();
            let queue_player = new_queue.splice(0,1)[0]
            let computer_player: Player = computers[computer_number].curr_player!;
            let to_add: Player = {
              play_start_time: null,
              queue_start_time: get_time(),
              computer_number: computer_number,
              videogame: computer_player.videogame,
              ID: computer_player.ID,
            };
            new_queue.push(to_add);
            queue_player.computer_number = computer_number;
            queue_player.play_start_time = get_time();
            new_computers[computer_number].curr_player = queue_player;
            setQueue(new_queue);
            check_queue_alert()
            setComputers(new_computers);
            addLog("Player "+computer_player.ID+" put back in queue and replaced with "+queue_player.ID+" on computer "+computers[computer_number].name)
          },()=>{}]
        })
      } else {
        let player: Player = computers[computer_number].curr_player!;
        remove_player_from_computer(computer_number);
        add_player(player.ID, player.videogame.name);
        addLog("Player "+player.ID+" put back in queue from computer "+computers[computer_number].name)
      }
    }
  }
  function timeLeft(comp:Computer):number {
    let time_playing = get_time() - comp.curr_player!.play_start_time!;
    let time_to_get_off = minimum_time - comp.curr_player!.videogame.leadout_time;
    return time_to_get_off-time_playing;
  }
  function check_queue_alert() {
    let computers_by_time_left = computers.filter((a)=>a.curr_player != null);
    computers_by_time_left.sort((a,b)=>timeLeft(a)-timeLeft(b));
    if(computers_by_time_left.length > queue.length && timeLeft(computers_by_time_left[queue.length]) < 0) {
      make_alert("Tell Player "+computers_by_time_left[queue.length].curr_player!.ID+" on computer "+computers_by_time_left[queue.length].name+" its their last game");
    }
  }
  function remove_player_from_computer(computer_number: number) {
    if (computers[computer_number].curr_player == null) {
      throw Error("No Player there!");
    } else {
      if(queue.length > 0) {
        add_question({
          message: "Place Player "+queue[0].ID+" on computer "+computers[computer_number].name+"?",
          options: ["Yes","No"],
          callbacks: [() =>{
            let new_computers = computers.slice();
            let player: Player = remove_player_from_queue(0);
            player.computer_number = computer_number;
            player.play_start_time = get_time();
            new_computers[computer_number].curr_player = player;
            setComputers(new_computers);
            addLog("Player "+computers[computer_number].curr_player!.ID+" replaced with "+player.ID+" on computer "+computers[computer_number].name)
          },()=>{}]
        })
      } else {
        let new_computers = computers.slice();
        new_computers[computer_number].curr_player = null;
        setComputers(new_computers);
        addLog("Player "+computers[computer_number].curr_player!.ID+" removed from computer "+computers[computer_number].name)
      }
    }
  }
  function available_computer(): number | null {
    for (let i = 0; i < computers.length; i++) {
      if (computers[i].curr_player == null) return i
    }
    return null;
  }
  function pop_player_from_queue(): boolean {
    let available = available_computer();
    if (available == null || queue.length == 0) return false;
    let computer_number: number = available!;
    let new_computers = computers.slice();
    let player: Player = remove_player_from_queue(0);
    player.computer_number = computer_number;
    player.play_start_time = get_time();
    new_computers[computer_number].curr_player = player;
    setComputers(new_computers);
    addLog("Player "+player.ID+" moved from queue to computer "+new_computers[computer_number].name)
    return true;
  }
  function computer_name_to_index(name: string): number | null {
    if (name == "Queue") return null;
    for (let i = 0; i < computers.length; i++) {
      if (computers[i].name == name) return i;
    }
    throw Error("name does not exist")
  }
  function default_computer_name(excluding:string|null = null): string {
    let names = computer_names(excluding);
    if (names.length > 1) {
      return names[1]!;
    } else {
      return "Queue";
    }
  }
  function computer_names(excluding:string|null = null): string[] {
    let to_return: string[] = ["Queue"];
    for (let i = 0; i < computers.length; i++) {
      if (computers[i].curr_player == null && computers[i].name != excluding) to_return.push(computers[i].name);
    }
    return to_return
  }
  function remove_player_from_queue(index:number): Player {
    addLog('Player '+queue[index].ID+" removed from queue")
    let new_queue = queue.slice();
    let to_return = new_queue.splice(index,1)[0]
    setQueue(new_queue);
    return to_return;
  }
  function add_question(q:question) {
      let new_new_questions = questions.slice();
      new_new_questions.push(q);
      setQuestions(new_new_questions);
  }
  function snooze_alert(message:string) {
    setTimeout(() =>{
      make_alert(message);
    },snoozeTime);
  }
  function make_alert(message: string) {
    add_question({
      message,
      options: ['Snooze '+(snoozeTime/1000)+'s','OK'],
      callbacks: [()=>snooze_alert(message),()=>{}]
    });
  }

  function update_warnings() {
    let num_over = 0;
    for(let i = 0; i<computers.length; i++) {
      if(computers[i].curr_player == null) continue;
      let time_playing = get_time() - computers[i].curr_player!.play_start_time!;
      let time_to_get_off = minimum_time - computers[i].curr_player!.videogame.leadout_time;
      if(time_playing>time_to_get_off) num_over ++;
    }
    if(queue.length > num_over) {
      for(let i = 0; i<computers.length; i++) {
        if(computers[i].curr_player == null) continue;
        let time_playing = get_time() - computers[i].curr_player!.play_start_time!;
        let time_to_get_off = minimum_time - computers[i].curr_player!.videogame.leadout_time;
        if(time_to_get_off>=time_playing && time_playing>=time_to_get_off-1000) {
          make_alert("Tell Player "+computers[i].curr_player!.ID+" on computer "+computers[i].name+" its their last game");
        }
      }
    }
  }

  setInterval(update_warnings,1000/MULTIPLIER)

  function update_game_name(idx:number,name:string) {
    let vgs = videogame_list.slice();
    vgs[idx].name = name;
    setVideogameList(vgs);
  }
  function update_lead_time(idx:number,input:string) {
    let vgs = videogame_list.slice();
    if(input=="") input = "0";
    let num = parseInt(input)
    vgs[idx].leadout_time = 60_000*num
    setVideogameList(vgs);
  }
  function remove_game(idx:number) {
    let vgs = videogame_list.slice();
    vgs.splice(idx,1);
    setVideogameList(vgs)
  }
  function add_game() {
    let vgs = videogame_list.slice();
    let to_add:videogame = {
      name: "???",
      leadout_time: vgs[vgs.length-1].leadout_time
    }
    vgs.splice(vgs.length-1,0,to_add);
    setVideogameList(vgs)
  }
  function change_comp_name(idx:number,name:string) {
    let comps = computers.slice()
    comps[idx].name = name;
    setComputers(comps);
  }
  function change_Y(idx:number,input:string) {
    let comps = computers.slice()
    if(input=="") input="0"
    let num = parseFloat(input)
    comps[idx].y = num
    setComputers(comps);
  }
  function change_X(idx:number,input:string) {
    let comps = computers.slice()
    if(input=="") input="0"
    let num = parseFloat(input)
    comps[idx].x = num
    setComputers(comps);
  }
  function add_computer() {
    let comps = computers.slice();
    comps.push({
      curr_player: null,
      x: 500,
      y: 500,
      name: "???"
    })
    setComputers(comps)
  }

  const onImageChange = (event:any) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setLayoutBG(URL.createObjectURL(img));
    }
  };
  function addLog(log:string) {
    let new_logs = logs.slice()
    new_logs.push(new Date().toString()+": "+log)
    setLogs(new_logs);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="wrapper">
        <CustomQuestionDialog
          q={questions[0]}
          open={questions.length > 0 && !questionFadingOut}
          setQuestionFadingOut={setQuestionFadingOut}
          questions={questions}
          setQuestions={setQuestions}
        />
        <header className='sub_section'>
         <div>
          <p style={{fontSize:"5vh"}}>
            TEC GAMER MANAGEMENT
            <button onClick={()=>setPage(0)} style={{maxHeight:"7vh",minHeight:"7vh",minWidth:"7vh",float:"right",marginTop:"1vh",marginRight:"1vw",paddingLeft:"0.4vw"}}><img src={monitor_icon.src} style={{maxHeight:"5.5vh"}}></img></button>
            <button onClick={()=>setPage(1)} style={{maxHeight:"7vh",float:"right",marginTop:"1vh",marginRight:"1vw"}}><img src={gear_icon.src} style={{maxHeight:"6vh"}}></img></button>
            <button onClick={()=>setPage(2)} style={{maxHeight:"7vh",minHeight:"7vh",minWidth:"7vh",float:"right",marginTop:"1vh",marginRight:"1vw"}}><img src={logs_icon.src} style={{maxHeight:"5vh"}}></img></button>
          </p>
          </div>
        </header>
        {
          page == 1?
          <div className='sub_section'>
            <div>
                Minimum Play Time: &emsp;
                <input style={{maxWidth:"3vw",marginTop:"3vw"}} value={minimum_time/60_000} type='text' onChange={(e)=>{if(e.target.value!="")setMinimumTime(parseInt(e.target.value)*60_000);else setMinimumTime(0)}}></input>&emsp;
                minutes
                <br/>
                <br/>
                Snooze Time: &emsp;
                <input style={{maxWidth:"3vw"}} value={snoozeTime/1_000} type='text' onChange={(e)=>{if(e.target.value!="")setSnoozeTime(parseInt(e.target.value)*1_000);else setSnoozeTime(0)}}></input>&emsp;
                seconds
                <br/>
                <br/>
                Layout Background: &emsp;
                <input style={{maxWidth:"5vw",fontSize:"1.25vh"}} type='file' onChange={onImageChange}></input>&emsp;
                <br/>
                <br/>
              {videogame_list.map((vg,idx)=>
              <>
                Game name: &emsp;
                <input value={vg.name} type='text' onChange={(e)=>update_game_name(idx,e.target.value)}></input>&emsp;
                Last Game Warning Time: &emsp;
                <input style={{maxWidth:"3vw"}} value={(vg.leadout_time/60_000).toFixed(0)} type='text' onChange={(e)=>update_lead_time(idx,e.target.value)}></input> minutes &emsp;
                <button disabled={idx == videogame_list.length-1} onClick={() => remove_game(idx)} style={{minWidth:"1.7vw", fontSize:"1.5vh"}}><p>X</p></button>
                <br/>
                <br/>
              </>
              )}
              <button onClick={() => add_game()} style={{minWidth:"1.7vw", fontSize:"1.5vh"}}><p>+</p></button>
                <br/>
                <br/>
              {computers.map((comp,idx)=><>
                Computer Name: 
                &emsp;
                <input style={{maxWidth:"3vw"}} value={comp.name} onChange={(e)=>change_comp_name(idx,e.target.value)} type='text'></input>
                &emsp;
                X:
                &emsp;
                <input style={{maxWidth:"3vw"}} value={comp.x} onChange={(e)=>change_X(idx,e.target.value)} type='text'></input>
                &emsp;
                Y:
                &emsp;
                <input style={{maxWidth:"3vw"}} value={comp.y} onChange={(e)=>change_Y(idx,e.target.value)} type='text'></input>
                &emsp;
                <br/>
                <br/>
              </>)}
              <button onClick={() => add_computer()} style={{minWidth:"1.7vw", fontSize:"1.5vh"}}><p>+</p></button>
                <br/>
                <br/>
            </div>
          </div>
          : page == 0?
          <>
        <nav>
          <Sidebar  computers={computers} add_player={add_player} queue={queue} pop_player_from_queue={pop_player_from_queue} default_computer_name={default_computer_name} computer_name_to_index={computer_name_to_index} computer_names={computer_names} remove_player_from_queue={remove_player_from_queue} setNextComputerName={setNextComputerName} nextComputerName={next_computer_name} videogame_list={videogame_list} setQueue={setQueue}/>
        </nav>
        <section>
            <ComputerField layoutBG={layoutBG} computers={computers} remove_player_from_computer={remove_player_from_computer} move_player_from_computer_to_queue={move_player_from_computer_to_queue} make_alert={make_alert} minimum_time={minimum_time}/>
        </section>
          </>
          :
          <div className='sub_section'>
            <div style={{paddingBottom:"5vw",marginTop:"1vw"}}>
              {logs.map((log)=><p>{log}</p>)}
            </div>
          </div>
        }
      </div>
    </main>
  )
}
