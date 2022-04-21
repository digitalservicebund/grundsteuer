import _ from "lodash";

export const removeUndefined = (data: Record<string, any>) => {
  Object.entries(data).forEach((entry) => {
    const key = entry[0];
    const value = entry[1];
    if (_.isObject(value)) {
      data[key] = _(removeUndefined(value))
        .omitBy(_.isNil)
        .omitBy(_.isEmpty)
        .value();
    }
    if (_.isArray(value)) {
      const resultingValue = value.map((item) =>
        _.isObject(item) || _.isArray(item) ? removeUndefined(item) : item
      );
      _.remove(resultingValue, _.isEmpty);
      _.remove(resultingValue, _.isNil);
      data[key] = resultingValue;
    }
  });
  return _(data).omitBy(_.isNil).omitBy(_.isEmpty).value();
};
