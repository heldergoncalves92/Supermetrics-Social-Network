import type { NextApiRequest, NextApiResponse } from 'next'
import { dataProvider } from "../../../lib/Common";
import { IAPIPostsResponse } from '../../../common/APITypes';

// You should notice that the client requests a certain page to the Server, and this one requests it to Supermetrics. 
// We have a bad flow from a performance standpoint, as the client needs to wait two requests in total.
// There are two main reason to keep it this way:
//      1. The supermetrics endpoint does not have enough information.
//         It would be a good practice to return the total number of posts or at least the total number of pages. 
//         This would support the pagination. To fix this flaw I keep the number of pages in my server.
//         This may not be the ideal value to store but is enough for the exercise.
//         The correct value to keep would be the total number of posts. 
//         Why? In the future, it would be way easier to change the number of displayed elements in the page,
//         where each user would be able to choose how many posts they would like to see.
//
//      2. The performance issue would also be easily solved with SSG, where we would re-evaluate the page from time to time.
//         This way avoids unnecessary requests to the Supermetrics server.

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const page = Number(req.query.page);

    if(isNaN(page)) {
        res.status(400).end();
        return;
    }

    const posts = await dataProvider.getPosts(page);
    const numberOfPages = dataProvider.getNumberOfPages();
    const result: IAPIPostsResponse = {
        numberOfPages,
        posts,
    };

    if (result.posts.length === 0 && (page < 1 || page > numberOfPages)) {
        res.status(404).end();
        return;
    }

    res.status(200).json(result);
}