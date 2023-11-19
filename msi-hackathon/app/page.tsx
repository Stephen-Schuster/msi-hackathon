"use client";
import React, { useState } from 'react';
import Sidebar from './sidebar';
import { Computer, Player, question } from '@/types';
import ComputerField from './computer_field';
import CustomQuestionDialog from './custom_question';

const NUM_COMPUTERS = 24;

export default function Home() {

  const [computers, setComputers] = useState<Computer[]>(default_computer_list());
  const [next_computer_name, setNextComputerName] = useState<string>(default_computer_name());
  const [queue, setQueue] = useState<Player[]>([]);
  const [questions,setQuestions] = useState<question[]>([]);
  const [curr_question,setCurrQuestion] = useState<question|undefined>(undefined);

  function default_computer_list(): Computer[] {
    let computers = [];
    for (let i = 0; i < NUM_COMPUTERS; i++) {
      let name = String.fromCharCode(65 + Math.floor(i/5))+(i%5+1);
      let x = 100.0/8 * (i%5+1);
      let y = 100 - 100.0/5 * (Math.floor(i/5)+1);
      if(i>=20) {
        x = 100.0*7/8;
        y = 100.0/5 * (i-19);
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
      to_add.play_start_time = new Date().getTime();
      let new_computers = computers.slice();
      new_computers[computer_number].curr_player = to_add;
      setComputers(new_computers);
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
      console.log(to_add);
      let new_queue = queue.slice();
      new_queue.push(to_add);
      setQueue(new_queue);
    }
  }
  function move_player_from_computer_to_queue(computer_number: number) {
    if (computers[computer_number].curr_player == null) {
      throw Error("No Player there!");
    } else {
      let player: Player = computers[computer_number].curr_player!;
      remove_player_from_computer(computer_number);
      add_player(player.ID, player.videogame);
    }
  }
  function remove_player_from_computer(computer_number: number) {
    if (computers[computer_number].curr_player == null) {
      throw Error("No Player there!");
    } else {
      let new_computers = computers.slice();
      new_computers[computer_number].curr_player = null;
      setComputers(new_computers);
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
    let new_queue = queue.slice();
    let to_return = new_queue.splice(index,1)[0]
    setQueue(new_queue);
    return to_return;
  }
  function close2_question() {
    let new_questions = questions.slice(1);
    setQuestions(new_questions);
  }
  function close1_question() {
    setCurrQuestion(questions[1]);
  }
  function add_question(q:question) {
      let new_new_questions = questions.slice();
      new_new_questions.push(q);
      setQuestions(new_new_questions);
      if(new_new_questions.length == 1) setCurrQuestion(new_new_questions[0]);
  }
  function snooze_alert(message:string) {
    setTimeout(() =>{
      add_question(make_alert(message))
    },10_000);
  }
  function make_alert(message: string):question {
    return {
      message,
      options: ['Snooze 60s','OK'],
      callbacks: [()=>snooze_alert(message),()=>{}]
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="wrapper">
        <CustomQuestionDialog
          q={questions[0]}
          open={questions.length > 0 && questions[0] == curr_question}
          onClose1={close1_question}
          onClose2={close2_question}
        />
        <header className='sub_section'>
          <div>
            <button onClick={() => {add_question(make_alert('TEST'))}}><p>Test Question</p></button>
          </div>
        </header>
        <nav>
          <Sidebar computers={computers} add_player={add_player} queue={queue} pop_player_from_queue={pop_player_from_queue} default_computer_name={default_computer_name} computer_name_to_index={computer_name_to_index} computer_names={computer_names} remove_player_from_queue={remove_player_from_queue} setNextComputerName={setNextComputerName} nextComputerName={next_computer_name}/>
        </nav>
        <section>
          <ComputerField computers={computers} remove_player_from_computer={remove_player_from_computer} move_player_from_computer_to_queue={move_player_from_computer_to_queue}/>
        </section>
      </div>
    </main>
  )
}
