
// By not having the register method in the interface we keep all the details of the connection in the specific implementation
// As other APIs may not need to register and get a temporary token for example.
// Thus we are able to get a better separation of concerns
// Example: Imagine a 'Offline Connector' that would get the data from the filesystem
export interface IConnector {
    getPosts(page: number): Promise<IPost[]>;
}

export interface IPost {
    id: string;
    from_name: string;
    from_id: string;
    message: string;
    type: string;
    created_time: string;
}
