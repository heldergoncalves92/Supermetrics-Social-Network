import type { IConnector, IPost } from "./IConnector";

const CLIENT_ID = process.env.CLIENT_ID;

interface ISupermetricsRegisterResponse {
    sl_token: string;
    client_id: string;
    email: string;
}

export interface IGetPostsResponse {
    page: number;
    posts: IPost[];
}

class SupermetricsConnector implements IConnector {
    private token: string | null = null;

    constructor(private email: string, private name: string) {}

    public async getPosts(page: number): Promise<IPost[]> {
        // Validate parameter to quick return
        if(page <= 0 || page > 10) {
            return [];
        }

        try {
            if(!this.token) {
                // Get a token if needed
                // Usually I would check if the token is still valid locally with the JWT library
                // This way it would be more efficient than do a request and expect it to fail with a 401 status
                await this.register();
            }
            
            const url = `https://api.supermetrics.com/assignment/posts?sl_token=${this.token}&page=${page}`;
            
            let res = await fetch(url);
            if(res.status === 401) {
                // Unauthorized: The token may be outdated
                this.token = null;
                await this.register();
                res = await fetch(url); // retry
            }
    
            if(!res.ok) {
                throw new Error("Return response is not OK");
            }
            
            const json = await res.json()
            if (json.errors) {
                throw new Error("Response has an invalid format");
            }
    
            const data = json.data as IGetPostsResponse;
            if (data.page !== page) {
                throw new Error("Returned response does not match with provided 'client_id'");
            }
     
            return data.posts;

        } catch (error) {
            console.error(error);
            return [];
        }
    }

    private async register(): Promise<void> {
        // Due to the asynchronous nature of the REST call, we may have several registers going on at the same time
        // If serialization was necessary we may simulate a locking mechanism with queueing promises

        const res = await fetch(" https://api.supermetrics.com/assignment/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "client_id": CLIENT_ID,
                "email": this.email,
                "name": this.name,
            }),
        }); 
        
        const json = await res.json()
        if (json.errors) {
            console.error(json.errors);
            throw new Error("Failed to register in API");
        }

        const data = json.data as ISupermetricsRegisterResponse;
        if (data.client_id !== CLIENT_ID) {
            throw new Error("Returned response does not match with provided 'client_id'");
        }

        if (data.email !== this.email) {
            throw new Error("Returned response does not match with provided 'email'");
        }

       this.token = data.sl_token;
    }
}

export default SupermetricsConnector;