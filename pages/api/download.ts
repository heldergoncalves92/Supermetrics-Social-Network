import type { NextApiRequest, NextApiResponse } from 'next'
import { dataProvider } from "../../lib/Common";
import { writeFileSync } from "fs";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    let page = 1;
    while(true) {
        let posts = await dataProvider.getPosts(page);
        
        if(posts?.length === 0) {
            break;
        }

        const filepath = `${process.env.OFFLINE_DATA_LOCATION}/page${page}.txt`;
        console.log(`Write ${filepath}`);
        writeFileSync(filepath, JSON.stringify(posts));
        page++;
    }    
    res.status(200).end(`Download ${page-1} pages.`);
}