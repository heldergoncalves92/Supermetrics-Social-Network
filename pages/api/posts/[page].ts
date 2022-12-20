import type { NextApiRequest, NextApiResponse } from 'next'
import { dataProvider } from "../../../lib/Common";
import { IAPIPostsResponse } from '../../../common/APITypes';

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