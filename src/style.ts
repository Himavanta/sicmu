export const createStyle = (textContent: string) =>
  document.head.appendChild(
    Object.assign(document.createElement('style'), {
      textContent,
    }),
  )
