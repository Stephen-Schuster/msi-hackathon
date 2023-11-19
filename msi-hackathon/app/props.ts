import { Computer, Player } from "@/types";

export type AddPlayerFormProps = {
    add_player:Function;
    available_computer:Function;
    computers:Computer[];
}
export type SidebarProps = {
    add_player:Function;
    available_computer:Function;
    computers:Computer[];
    queue:Player[];
}
export type PlayerQueueProps = {
    queue: Player[];
}