import type { IPost } from "./IConnector";
import type { IUser, IUserInfo } from "./IDataProvider";

export interface IUserDataManager {
    getUsers(): IUser[];
    getUserInfo(id: string): IUserInfo | undefined;
    processPosts(posts: IPost[]): void;
}