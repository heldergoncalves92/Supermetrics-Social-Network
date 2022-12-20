import { IPost } from "../lib/IConnector";
import { IUser } from "../lib/IDataProvider";

export interface IAPIUserInfo {
    id: string;
    name: string;
    number_posts: number;
    median_charaters: number;
    number_posts_per_month: [string, number][];
    longest_post: number;
}

export interface IAPIPostsResponse {
    posts: IPost[];
    numberOfPages: number;
}

export interface IAPIUsersResponse {
    users: IUser[];
}