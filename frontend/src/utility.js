export const updateObject = (oldObject, updatedProperties) => {
  return {
    ...oldObject,
    ...updatedProperties,
  };
};

export const isSubList = (list, subList) =>
  subList.every((elem) => list.includes(elem));
