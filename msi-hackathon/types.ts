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
    videogame: string;
    ID: string;
}