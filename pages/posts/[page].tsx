import { useRouter } from 'next/router';
import Posts from '../../components/Posts';

export interface IPostsProps {
    page: number;
}

export default function PostsByPage(): JSX.Element {
    const router = useRouter();
    const page = Number(router.query.page);
    return <Posts page={page} />;
}