import { Address } from '@wormgraph/helpers'

export const truncateAddress = (address: Address, decorator?: { prefixLength: number; suffixLength: number }) => {
  const prefixLength = decorator?.prefixLength || 4
  const suffixLength = decorator?.suffixLength || 5
  return `${address.slice(0, prefixLength)}...${address.slice(address.length - suffixLength, address.length)}`
}

export const checkIfValidUrl = (text: string) => {
  const matches = text.match(
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/g
  )
  return matches && matches.length > 0
}

export const checkIfValidEmail = (text: string) => {
  const matches = String(text)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  return matches && matches.length > 0
}

export const encodeURISafe = (stringFragment: string) =>
  encodeURIComponent(stringFragment).replace(/'/g, '%27').replace(/"/g, '%22')

export const calculateDaysBetween = (unixTimestamp: number) => {
  // To set two dates to two variables
  const date1 = new Date(unixTimestamp)
  const date2 = new Date()

  // To calculate the time difference of two dates
  const Difference_In_Time = date2.getTime() - date1.getTime()

  // To calculate the no. of days between two dates
  const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24)

  return Difference_In_Days
}

type detectMobileAddressBarSettings = {
  userAgent: 'ios' | 'android' | 'other'
  addressBarlocation: 'top' | 'bottom' | 'hidden'
  addressBarHeight: number
}
export const detectMobileAddressBarSettings = (): detectMobileAddressBarSettings => {
  // This code will only work if the user is viewing the page in a mobile browser
  // on an Android device or a Safari mobile browser

  // First, we need to check if the user is viewing the page on a mobile device
  if (window.innerWidth < 768) {
    // Next, we need to check if the user is using an Android mobile device
    if (navigator.userAgent.toLowerCase().indexOf('android') > -1) {
      // Android mobile devices have the address bar at the top, so we can use
      // the screen height to determine if the address bar is taking up space
      if (window.innerHeight < screen.height) {
        // If the inner height is less than the screen height, it means that the
        // address bar is taking up space, so we can assume that the user is
        // using an Android mobile device with the address bar taking up space
        console.log('The user is using an Android mobile device with the top address bar taking up space')
        const addressBarHeight = screen.height - window.innerHeight
        return {
          userAgent: 'android',
          addressBarlocation: 'top',
          addressBarHeight: addressBarHeight,
        }
      } else {
        // If the inner height is equal to the screen height, it means that the
        // address bar is not taking up space, so we can assume that the user is
        // using an Android mobile device with the address bar hidden
        console.log('The user is using an Android mobile device with the top address bar hidden')
        return {
          userAgent: 'android',
          addressBarlocation: 'hidden',
          addressBarHeight: 0,
        }
      }
    } else if (
      navigator.userAgent.toLowerCase().indexOf('safari') > -1 &&
      navigator.userAgent.toLowerCase().indexOf('iphone') > -1
    ) {
      // Safari mobile devices have the address bar at the bottom, so we can use
      // the screen height and the inner height to determine if the address bar
      // is taking up space
      if (window.innerHeight < screen.height - 1) {
        // If the difference between the inner height and the screen height is
        // greater than 1, it means that the address bar is taking up space, so
        // we can assume that the user is using a Safari mobile browser with the
        // address bar taking up space
        console.log('The user is using a Safari mobile browser with the bottom address bar taking up space')
        const addressBarHeight = screen.height - window.innerHeight
        return {
          userAgent: 'ios',
          addressBarlocation: 'bottom',
          addressBarHeight: addressBarHeight,
        }
      } else {
        // If the difference between the inner height and the screen height is
        // less than or equal to 1, it means that the address bar is not taking
        // up space, so we can assume that the user is using a Safari mobile
        // browser with the address bar hidden
        console.log('The user is using a Safari mobile browser with the bottom address bar hidden')
        return {
          userAgent: 'ios',
          addressBarlocation: 'hidden',
          addressBarHeight: 0,
        }
      }
    }
  }
  return {
    userAgent: 'other',
    addressBarlocation: 'hidden',
    addressBarHeight: 0,
  }
}
