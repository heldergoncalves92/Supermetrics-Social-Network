import { IAPIUserInfo } from "../common/APITypes";

const UserDetails = ({ ...userInfo }: IAPIUserInfo): JSX.Element => {
    return (
      <div>
          <div><b>Name:</b> {userInfo.name}</div>
          <div><b>Number of Posts:</b> {userInfo.number_posts}</div>
          <div><b>Longest Post:</b> {userInfo.longest_post}</div>
          <div><b>Median charaters:</b> {userInfo.median_charaters}</div>
          <div><b>Posts per month:</b> {userInfo.number_posts_per_month.map(entry => <span key={entry[0]}>{`[${entry[0]}: ${entry[1]}], `}</span>)}</div>
      </div>
    );
}
  
export default UserDetails;