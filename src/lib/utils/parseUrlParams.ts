const parseUrlParams = (name: string, url = window.location.href): string | null => {
  console.log(url)
  const parsedURL = new URL(url)
  return parsedURL.searchParams.get(name)
}

// const parseUrlParams = (name: string, url = window.location.href): string | undefined => {
//   name = name.replace(/[\[\]]/g, '\\$&')
//   var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
//     results = regex.exec(url)
//   if (!results) return undefined
//   if (!results[2]) return ''
//   return decodeURIComponent(results[2].replace(/\+/g, ' '))
// }

export default parseUrlParams
