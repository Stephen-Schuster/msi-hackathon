export const MULTIPLIER = 1
export default function get_time():number {
    return new Date().getTime()*MULTIPLIER
}