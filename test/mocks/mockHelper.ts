export const getMockedFunction = (
  module: any,
  method: string,
  returnValue: any
) =>
  jest
    .spyOn(module, method)
    .mockImplementation(
      jest.fn(() => Promise.resolve(returnValue)) as jest.Mock
    );

export const getThrowingMockedFunction = (
  module: any,
  method: string,
  error: any
) =>
  jest.spyOn(module, method).mockImplementation(
    jest.fn(() => {
      throw error;
    }) as jest.Mock
  );

export const callWithMockedTime = async (
  timestamp: number,
  callback: () => void
) => {
  const actualNowImplementation = Date.now;
  try {
    Date.now = jest.fn(() => timestamp);
    await callback();
  } finally {
    Date.now = actualNowImplementation;
  }
};
