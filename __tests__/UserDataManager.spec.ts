import {describe, expect, test} from '@jest/globals';
import { IPost } from '../lib/IConnector';
import UserDataManager from '../lib/UserDataManager';
import { createFactory } from '../common/Helpers';

const createPostProps = createFactory<IPost>({
    id: "",
    from_name: "",
    from_id: "",
    message: "",
    type: "",
    created_time:  new Date().toISOString(),
});

describe("UserDataManager", () => {
  test("Instantiated UserDataManager does not contain data", () => {
    // Arrange & Act
    const manager = new UserDataManager();
    
    // Assert
    expect(manager.getUsers()).toHaveLength(0);
  });

  test("Process post adds user to the list of users", () => {
    // Arrange
    const manager = new UserDataManager();
    const post = createPostProps({from_id: "id1", from_name: "Some Name A" });

    // Act
    manager.processPosts([post]);
    
    // Assert
    const users = manager.getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].id).toStrictEqual(post.from_id);
    expect(users[0].name).toStrictEqual(post.from_name);
  });

  test("Process posts from the same user doess not return duplicated users", () => {
    // Arrange
    const userId = "id1";
    const userName = "Some Name A";
    const manager = new UserDataManager();
    const post1 = createPostProps({from_id: userId, from_name: userName });
    const post2 = createPostProps({from_id: userId, from_name: userName });

    // Act
    manager.processPosts([post1, post2]);
    
    // Assert
    const users = manager.getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].id).toStrictEqual(userId);
    expect(users[0].name).toStrictEqual(userName);
  });

  test("User basic info is the the expected in the UserInfo", () => {
    // Arrange
    const userId = "id1";
    const userName = "Some Name A";
    const manager = new UserDataManager();
    const post1 = createPostProps({from_id: userId, from_name: userName, message: "Small Message" });
    const post2 = createPostProps({from_id: userId, from_name: userName, message: "A large message must be set here!!" });

    // Act
    manager.processPosts([post1, post2]);
    
    // Assert
    const userInfo = manager.getUserInfo(userId);
    expect(userInfo).not.toBeNull();
    expect(userInfo?.id).toEqual(userId);
    expect(userInfo?.name).toEqual(userName);    
  });

  test("Longest post metric is the the expected in the UserInfo", () => {
    // Arrange
    const userId = "id1";
    const userName = "Some Name A";
    const manager = new UserDataManager();
    const post1 = createPostProps({from_id: userId, from_name: userName, message: "Small Message" });
    const post2 = createPostProps({from_id: userId, from_name: userName, message: "A large message must be set here!!" });

    // Act
    manager.processPosts([post1, post2]);
    
    // Assert
    const userInfo = manager.getUserInfo(userId);
    expect(userInfo?.longest_post).toEqual(post2.message.length);
  });

  test("Median post metric is the the expected in the UserInfo when even number of posts is processed", () => {
    // Arrange
    const userId = "id1";
    const userName = "Some Name A";
    const manager = new UserDataManager();
    const post1 = createPostProps({from_id: userId, from_name: userName, message: "Small Message" });
    const post2 = createPostProps({from_id: userId, from_name: userName, message: "A large message must be set here!!" });

    // Act
    manager.processPosts([post1, post2]);
    
    // Assert
    const userInfo = manager.getUserInfo(userId);
    expect(userInfo?.median_charaters).toEqual(( post1.message.length + post2.message.length) / 2);
  });

  test("Median post metric is the the expected in the UserInfo when odd number of posts is processed", () => {
    // Arrange
    const userId = "id1";
    const userName = "Some Name A";
    const manager = new UserDataManager();
    const post1 = createPostProps({from_id: userId, from_name: userName, message: "This is the middle!!" });
    const post2 = createPostProps({from_id: userId, from_name: userName, message: "Small Message" });
    const post3 = createPostProps({from_id: userId, from_name: userName, message: "A large message must be set here!!" });

    // Act
    manager.processPosts([post1, post2, post3]);
    
    // Assert
    const userInfo = manager.getUserInfo(userId);
    expect(userInfo?.median_charaters).toEqual(post1.message.length);
  });

  // TODO: Missing tests related to posts per month
});