import { Computer, Player, videogame } from "@/types";

export type AddPlayerFormProps = {
    add_player:Function;
    default_computer_name: Function;
    computer_name_to_index: Function;
    computers: Computer[];
    nextComputerName: string;
    setNextComputerName: Function;
    videogame_list: videogame[];
}
export type SidebarProps = {
    add_player:Function;
    queue:Player[];
    pop_player_from_queue: Function;
    default_computer_name: Function;
    computer_name_to_index: Function;
    computer_names: Function;
    remove_player_from_queue: Function;
    computers: Computer[];
    nextComputerName: string;
    setNextComputerName: Function;
    videogame_list: videogame[];
    setQueue: Function;
}
export type PlayerQueueProps = {
    queue: Player[];
    pop_player_from_queue: Function;
    default_computer_name: Function;
    computer_name_to_index: Function;
    computer_names: Function;
    remove_player_from_queue: Function;
    computers: Computer[];
    nextComputerName: string;
    setNextComputerName: Function;
    setQueue: Function;
}
export type PlayerInQueueProps = {
    change:Function;
    idx: number;
    player: Player;
    remove_player_from_queue: Function;
}
export type ComputerFieldProps = {
    minimum_time:number;
    computers:Computer[];
    remove_player_from_computer: Function;
    move_player_from_computer_to_queue: Function;
    make_alert: Function;
    layoutBG: string|null;
}
export type ComputerIconProps = {
    minimum_time:number;
    computer:Computer;
    remove_player_from_computer: Function;
    move_player_from_computer_to_queue: Function;
    index: number;
    make_alert: Function
}