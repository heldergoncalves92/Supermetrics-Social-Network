import type {IPost} from "./IConnector";

export interface IUser {
    id: string;
    name: string;
}

export interface IUserInfo extends IUser {
    number_posts: number;
    median_charaters: number;
    number_posts_per_month: Map<string, number>;
    longest_post: number;
}

export interface IDataProvider {
    getNumberOfPages(): number;
    getPosts(page: number): Promise<IPost[]>;
    
    getUsers(): IUser[];
    getUserInfo(user: string): IUserInfo | undefined;
}
