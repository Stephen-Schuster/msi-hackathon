"use client";
import React, { useState } from 'react';
import layout from '../images/tec_layout.png';
import Sidebar from './sidebar';
import { Computer, Player } from '@/types';

const NUM_COMPUTERS = 24;

export default function Home() {

  const [computers, setComputers] = useState<Computer[]>(default_computer_list());
  const [queue, setQueue] = useState<Player[]>([]);

  function default_computer_list(): Computer[] {
    let computers = [];
    for (let i = 0; i < NUM_COMPUTERS; i++) {
      let name = i.toString();
      if (i < 5) name = "A" + (i + 1);
      else if (i < 10) name = "B" + (i + 1 - 5);
      else if (i < 15) name = "C" + (i + 1 - 10);
      else if (i < 20) name = "D" + (i + 1 - 15);
      else if (i < 24) name = "E" + (i + 1 - 20);
      computers.push({
        curr_player: null,
        name: name
      })
    }
    return computers;
  }

  function add_player(ID: string, videogame: string = "Other", computer_number: number | null = null) {
    let to_add: Player = {
      play_start_time: null,
      queue_start_time: new Date().getTime(),
      computer_number: computer_number,
      videogame: videogame,
      ID: ID
    };
    if (computer_number != null) {
      if (computers[computer_number].curr_player == null ||
        confirm(
          "Someone is already playing on Computer " +
          computers[computer_number].name +
          ". Are you sure you want to kick off the current player?"
        )) {
        to_add.play_start_time = new Date().getTime();
        computers[computer_number].curr_player = to_add;
      }
    } else {
      console.log(to_add);
      let new_queue = queue.slice();
      new_queue.push(to_add);
      setQueue(new_queue);
    }
  }
  function move_player_from_computer_to_queue(computer_number: number) {
    if (computers[computer_number].curr_player == null) {
      alert("No Player there!");
    } else {
      let player: Player = computers[computer_number].curr_player!;
      let new_computers = computers.slice();
      new_computers[computer_number].curr_player = null;
      setComputers(new_computers);
      add_player(player.ID, player.videogame);
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
    player.play_start_time = new Date().getTime();
    new_computers[computer_number].curr_player = player;
    setComputers(new_computers);
    return true;
  }
  function computer_name_to_index(name: string): number | null {
    if (name == "Queue") return null;
    for (let i = 0; i < computers.length; i++) {
      if (computers[i].name == name) return i;
    }
    throw Error("name does not exist")
  }
  function default_computer_name(): string {
    let names = computer_names();
    if (names.length > 1) {
      return names[1]!;
    } else {
      return "Queue";
    }
  }
  function computer_names(): string[] {
    let to_return: string[] = ["Queue"];
    for (let i = 0; i < computers.length; i++) {
      if (computers[i].curr_player == null) to_return.push(computers[i].name);
    }
    return to_return
  }
  function remove_player_from_queue(index:number): Player {
    let new_queue = queue.slice();
    let to_return = new_queue.splice(index,1)[0]
    setQueue(new_queue);
    return to_return;
  }

  console.log(queue)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="wrapper">
        <header>HEADER</header>
        <nav>
          <Sidebar add_player={add_player} queue={queue} pop_player_from_queue={pop_player_from_queue} default_computer_name={default_computer_name} computer_name_to_index={computer_name_to_index} computer_names={computer_names} remove_player_from_queue={remove_player_from_queue}/>
        </nav>
        <section>
          <img src={layout.src} alt="layout"></img>
        </section>
      </div>
    </main>
  )
}
