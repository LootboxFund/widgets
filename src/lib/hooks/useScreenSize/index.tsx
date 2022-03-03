import { useEffect, useState } from 'react'

export type ScreenSize = 'mobile' | 'tablet' | 'desktop' | undefined

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined
    height: number | undefined
    screen: ScreenSize
  }>({
    width: undefined,
    height: undefined,
    screen: undefined,
  })
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
        screen: determineScreen(window.innerWidth),
      })
    }
    // Add event listener
    window.addEventListener('resize', handleResize)
    // Call handler right away so state gets updated with initial window size
    handleResize()
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures that effect is only run on mount
  const determineScreen = (width: number) => {
    if (width <= 560) {
      return 'mobile'
    }
    if (width > 560 && width < 1080) {
      return 'tablet'
    }
    return 'desktop'
  }
  return windowSize
}

export default useWindowSize
