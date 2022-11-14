export interface Path {
    id: string;
    path: string
}

export interface Item {
    id: string;
    name: string;
    filename: string;
    picture: string;
    paths: Array<Path>;
    tracked: boolean;
    synchronised: boolean;
}
