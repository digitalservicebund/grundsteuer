import _ from "lodash";

export const removeUndefined = (
  data: Record<string, any>,
  trimOutput?: boolean
) => {
  Object.entries(data).forEach((entry) => {
    const key = entry[0];
    const value = entry[1];

    if (_.isString(value) && trimOutput) {
      data[key] = value.trim();
    }
    if (_.isObject(value)) {
      data[key] = _(removeUndefined(value, trimOutput))
        .omitBy(_.isNil)
        .omitBy(_.isEmpty)
        .value();
    }
    if (_.isArray(value)) {
      const resultingValue = value.map((item) =>
        _.isObject(item) || _.isArray(item)
          ? removeUndefined(item, trimOutput)
          : item
      );
      _.remove(resultingValue, _.isEmpty);
      _.remove(resultingValue, _.isNil);
      data[key] = resultingValue;
    }
  });
  return _(data).omitBy(_.isNil).omitBy(_.isEmpty).value();
};
