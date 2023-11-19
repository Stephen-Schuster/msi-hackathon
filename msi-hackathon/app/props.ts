import { Computer, Player } from "@/types";

export type AddPlayerFormProps = {
    add_player:Function;
    default_computer_name: Function;
    computer_name_to_index: Function;
    computer_names: Function;
}
export type SidebarProps = {
    add_player:Function;
    queue:Player[];
    pop_player_from_queue: Function;
    default_computer_name: Function;
    computer_name_to_index: Function;
    computer_names: Function;
    remove_player_from_queue: Function;
}
export type PlayerQueueProps = {
    queue: Player[];
    pop_player_from_queue: Function;
    default_computer_name: Function;
    computer_name_to_index: Function;
    computer_names: Function;
    remove_player_from_queue: Function;
}
export type PlayerInQueueProps = {
    idx: number;
    player: Player;
    remove_player_from_queue: Function;
}
export type ComputerFieldProps = {
    computers:Computer[];
    remove_player_from_computer: Function;
    move_player_from_computer_to_queue: Function;
}
export type ComputerIconProps = {
    computer:Computer;
    remove_player_from_computer: Function;
    move_player_from_computer_to_queue: Function;
    index: number;
}