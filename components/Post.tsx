import { getUserInfoPageLink } from "../common/Helpers";
import { IPost } from "../lib/IConnector";

const Post = ({ ...post }: IPost): JSX.Element => {
    return (
      <div>
          <div>Created By: <a href={getUserInfoPageLink(post.from_id)}>{post.from_name}</a>, at {post.created_time}</div>
          <div>{post.message}</div>
          <br/>
          <hr/>
          <br/>
      </div>
    );
}
  
export default Post;