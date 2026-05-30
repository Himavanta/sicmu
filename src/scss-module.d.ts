declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.scss?inline' {
  const css: string
  export default css
}
