export interface Item {
    id: string;
    name: string;
    filename: string;
    picture: string;
    paths: Array<string>;
    tracked: boolean;
    synchronised: boolean;
}
