import _ from "lodash";

export const removeUndefined = (
  data: Record<string, any>,
  trimOutput?: boolean
) => {
  const filteredData = _.cloneDeep(data);
  Object.entries(filteredData).forEach((entry) => {
    const key = entry[0];
    const value = entry[1];

    if (_.isString(value) && trimOutput) {
      filteredData[key] = value.trim();
    }
    if (_.isObject(value)) {
      filteredData[key] = _(removeUndefined(value, trimOutput))
        .omitBy(_.isNil)
        .omitBy(isEmptyExceptEmptyString)
        .value();
    }
    if (_.isArray(value)) {
      const resultingValue = value.map((item) => {
        if (_.isObject(item) || _.isArray(item)) {
          return removeUndefined(item, trimOutput);
        } else if (_.isString(item) && trimOutput) {
          return item.trim();
        } else {
          return item;
        }
      });
      _.remove(resultingValue, _.isEmpty);
      _.remove(resultingValue, _.isNil);
      filteredData[key] = resultingValue;
    }
  });
  return _(filteredData).omitBy(isEmptyExceptEmptyString).value();
};

const isEmptyExceptEmptyString = (value: any) => {
  return value !== "" && _.isEmpty(value);
};
