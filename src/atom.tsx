import { atom } from "recoil"

export interface IId {
    Id: string;
}

export const MovieIdState = atom<string>({
    key: 'id',
    default: '508947',
})