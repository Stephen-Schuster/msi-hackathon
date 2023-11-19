export type Computer = {
    curr_player: Player | null;
    name: string;
    x: number;
    y: number;
}
export type Player = {
    play_start_time: number | null;
    queue_start_time: number;
    computer_number: number | null;
    videogame: videogame;
    ID: string;
}
export type question = {
    message: string;
    options: string[];
    callbacks: Function[];
}
export type videogame = {
    name: string;
    leadout_time: number;
}