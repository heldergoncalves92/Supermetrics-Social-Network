import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IAPIUserInfo } from "../../common/APITypes";
import UserDetails from "../../components/UserDetails";
import { getUsersPageLink } from "../../common/Helpers";

/* User Dashboard route */
export default function Users(): JSX.Element {
    const router = useRouter();
    const userId = router.query.userId;

    const [message, setMessage] = useState("Loading...");
    const [userInfo, setUserInfo] = useState<IAPIUserInfo>();

    useEffect(() => {
        // In nextJS the 'useRouter' does not have the corrrect 'userId' in the first render
        // This avoids unnecessary requests to server
        if(!userId) {
            return;
        }

        fetch(`/api/users/${userId}`)
        .then(async (res) => {
            if(res.ok) {
                const data = await res.json() as IAPIUserInfo;
                setUserInfo(data);
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
    }, [userId]);

    if(message) {
        return <div>{message}</div>;
    }

    return <>
        <h3>
            <a href={getUsersPageLink()}>Check other users</a>
        </h3>
        <br/>

        {userInfo && <UserDetails {...userInfo} />}
    </>;
}