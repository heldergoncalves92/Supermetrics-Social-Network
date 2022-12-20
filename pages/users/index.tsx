import { useEffect, useState } from "react";
import { IAPIUsersResponse } from "../../common/APITypes";
import { getUserInfoPageLink } from "../../common/Helpers";
import { IUser } from "../../lib/IDataProvider";

/* This route will help the user to navigate though all users that are known by the server */
export default function Users(): JSX.Element {
    const [message, setMessage] = useState("Loading");
    const [users, setUsers] = useState<IUser[]>();

    useEffect(() => {
        fetch(`http://${window.location.host}/api/users`)
        .then(async (res) => {
            if(res.ok) {
                const data = await res.json() as IAPIUsersResponse;
                setUsers(data.users);
                setMessage("");
            } else {
                setMessage("Something unexpected happen");
            }
        });
    }, []);

    if(message) {
        return <div>{message}</div>;
    }

    return <div>
        {users?.map(p => {
            return (
                <div key={p.id}>
                    <a href={getUserInfoPageLink(p.id)}>{p.name}</a>
                </div>
            );
        })}
    </div>;
}