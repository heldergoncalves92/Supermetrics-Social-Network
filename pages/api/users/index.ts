import type { NextApiRequest, NextApiResponse } from 'next'
import type { IAPIUsersResponse } from '../../../common/APITypes';
import { dataProvider } from "../../../lib/Common";

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
    const result: IAPIUsersResponse = {
        users: dataProvider.getUsers(),
    };
    res.status(200).json(result);
}