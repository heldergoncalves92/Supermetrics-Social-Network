import { useEffect, useState } from 'react';
import Pagination from './Pagination';
import Post from './Post';
import { IPost } from '../lib/IConnector';
import type { IAPIPostsResponse } from '../common/APITypes';

export interface IPostsProps {
    page: number;
}

const Posts = ({ page }: IPostsProps): JSX.Element => {
    const [message, setMessage] = useState("Loading");
    const [totalPages, setTotalPages] = useState(-1);
    const [posts, setPosts] = useState<IPost[]>();

    useEffect(() => {
        if (isNaN(page)) {
            return;
        }

        fetch(`/api/posts/${page}`)
        .then(async (res) => {
            if(res.ok) {
                const data = await res.json() as IAPIPostsResponse;
                setPosts(data.posts);
                setTotalPages(data.numberOfPages);
                setMessage("");
            } else {
                if(res.status === 404) {
                    // Simulate an HTTP redirect with 'replace'
                    window.location.replace("/404");
                    return;
                }
                setMessage("Something unexpected happen");
            }
        });
    }, [page]);

    function redirectToNewPage(newPage: number) {
        window.location.assign(`/posts/${newPage}`);
    }

    if(message) {
        return <div>{message}</div>;
    }

    return <div>
        <Pagination
            current={page}
            numberOfPages={totalPages}
            pageOptionClicked={newPage => redirectToNewPage(newPage)}
            previousPageClicked={() => redirectToNewPage(Math.max(page - 1, 1))}
            nextPageClicked={() => redirectToNewPage(Math.min(page + 1, totalPages))}
        />

        {posts?.map(p => <Post key={p.id} {...p} />)}
    </div>;
}

export default Posts;