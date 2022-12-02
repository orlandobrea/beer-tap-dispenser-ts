export const codifyError = (err: any, code: string) => {
  err.code = code;
  return err;
}
