export const falsy = (v: any): v is false => {
  return !(v as boolean)
}
