import phoneDbUtil from "./phoneDbUtil";

export const initDatabase = () => phoneDbUtil.initDatabase();

export const getUserFilters = (storeName = "Filters") =>
  phoneDbUtil.getUserFilters(storeName);

export const insertFilters = (filterName, jsonData, storeName = "Filters") =>
  phoneDbUtil.insertFilters(filterName, jsonData, storeName);

export const deleteFilters = (filterName) =>
  phoneDbUtil.deleteFilters(filterName);
