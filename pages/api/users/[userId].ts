import type { NextApiRequest, NextApiResponse } from 'next'
import type{ IAPIUserInfo } from '../../../common/APITypes';
import { dataProvider } from "../../../lib/Common";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    const userInfo = await dataProvider.getUserInfo(req.query.userId as string);

    if (!userInfo) {
        res.status(404).end();
        return;
    }

    const number_posts_per_month: [string, number][] = [];
    userInfo?.number_posts_per_month.forEach((value, key) => number_posts_per_month.push([key, value]));

    const result: IAPIUserInfo = {
        ...userInfo,
        number_posts_per_month,
    };

    res.status(200).json(result);
}