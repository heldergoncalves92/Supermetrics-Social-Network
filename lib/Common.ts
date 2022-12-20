import DataProvider from "./DataProvider";
import type { IDataProvider } from "./IDataProvider";
import SupermetricsConnector from "./SupermetricsConnector";
import UserDataManager from "./UserDataManager";

export const dataProvider : IDataProvider = new DataProvider(
    new UserDataManager(),
    (email, name) => new SupermetricsConnector(email, name));