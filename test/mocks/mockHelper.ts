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
