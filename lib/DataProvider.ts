import type { IConnector, IPost } from "./IConnector";
import type {IDataProvider, IUser, IUserInfo} from "./IDataProvider";
import { IUserDataManager } from "./IUserDataManager";

const email = process.env.EMAIL as string;
const userName = process.env.NAME as string;

export type ConnectorBuilder = (email: string, name: string) => IConnector;

class DataProvider implements IDataProvider {
    private connector: IConnector;
    private numberOfPages = 0;
        
    constructor(private userDataManager: IUserDataManager, connectorBuilder: ConnectorBuilder) {
        this.connector = connectorBuilder(email, userName);
        this.initialize();
    }

    public async getPosts(page: number): Promise<IPost[]> {
        return await this.connector.getPosts(page);
    }

    public getUserInfo(userId: string): IUserInfo | undefined {
        return this.userDataManager.getUserInfo(userId);
    }

    public getNumberOfPages(): number {
        return this.numberOfPages;
    }

    public getUsers(): IUser[] {
        return this.userDataManager.getUsers();
    }

    private async initialize(): Promise<void> {
        let page = 1;
        while(true) {
            let posts = await this.connector.getPosts(page++);
            
            if(posts?.length === 0) {
                break;
            }

            this.numberOfPages++;
            this.userDataManager.processPosts(posts);
        }
    }
}

export default DataProvider;