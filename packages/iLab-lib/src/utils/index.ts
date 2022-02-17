/**
 * 删除对象中所有的空值
 * @param obj
 */
export const removeObjectNull = (obj: { [key: string]: any }) => {
  const newObj: { [key: string]: any } = {};
  Object.keys(obj).forEach(key => {
    if (obj[key]) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};
