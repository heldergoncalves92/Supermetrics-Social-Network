import { IPost } from "./IConnector";
import { IUser, IUserInfo } from "./IDataProvider";
import { IUserDataManager } from "./IUserDataManager";

interface IInternalUserInfo {
    userInfo: IUserInfo;
    medianHelper: number[];
}

class UserDataManager implements IUserDataManager {
    private userInfos = new Map<string, IInternalUserInfo>(); 

    public getUsers(): IUser[] {
        const users: IUser[] = [];
        this.userInfos.forEach(u => users.push({ id: u.userInfo.id, name: u.userInfo.name }));
        return users;
    }

    public getUserInfo(id: string): IUserInfo | undefined {
        return this.userInfos.get(id)?.userInfo;
    }

    public processPosts(posts: IPost[]): void {
        posts.forEach(p => {
            let info = this.userInfos.get(p.from_id);

            if(!info) {
                UserDataManager.addNewUserInfo(this.userInfos, p);
            } else {
                UserDataManager.updateUserInfo(info, p);
            }
        });
    }

    private static addNewUserInfo(userInfos: Map<string, IInternalUserInfo>, p: IPost): void {
        const number_posts_per_month = new Map<string, number>();
        UserDataManager.IncrementPostsPerMonth(number_posts_per_month, p.created_time);
        const messageLength = p.message.length;

        const newUserInfo: IUserInfo = {
            id: p.from_id,
            name: p.from_name,
            number_posts: 1,
            longest_post: messageLength,
            median_charaters: messageLength, 
            number_posts_per_month,
        }; 

        const internalUserInfo: IInternalUserInfo = {
            userInfo: newUserInfo,
            medianHelper: [messageLength],
        };

        userInfos.set(p.from_id, internalUserInfo);
    }

    private static updateUserInfo(internalUserInfo: IInternalUserInfo, p: IPost): void {
        const currentInfo = internalUserInfo.userInfo;
        currentInfo.number_posts++;
        UserDataManager.IncrementPostsPerMonth(currentInfo.number_posts_per_month, p.created_time);
        
        const messageLength = p.message.length;
        if(messageLength > currentInfo.longest_post) {
            currentInfo.longest_post = messageLength;
        }

        internalUserInfo.medianHelper.push(messageLength);
        internalUserInfo.medianHelper.sort();

        if(currentInfo.number_posts % 2 === 0) {
            const baseIndex = currentInfo.number_posts>>1;
            const first = internalUserInfo.medianHelper[baseIndex - 1];
            const second = internalUserInfo.medianHelper[baseIndex];
            currentInfo.median_charaters = (first + second) / 2;
        } else {
            currentInfo.median_charaters = internalUserInfo.medianHelper[currentInfo.number_posts>>1];
        } 
    }

    private static IncrementPostsPerMonth(number_posts_per_month: Map<string, number>, stringDate: string) {
        const date = new Date(stringDate);
        const dateKey = `${date.getFullYear()}-${date.getMonth()}`;
        const currentValue = number_posts_per_month.get(dateKey);
        const valueToSet = currentValue ? currentValue + 1 : 1;
        number_posts_per_month.set(dateKey, valueToSet);    
    }
}

export default UserDataManager;