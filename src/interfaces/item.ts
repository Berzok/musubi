export interface Path {
    id: string;
    path: string
}

export interface Item {
    id: string;
    about: string;
    name: string;
    image: string;
    paths: Array<Path>;
    tracked: boolean;
    synchronised: boolean;
}
