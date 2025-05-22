import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    const onMotionChange = () => {
      setReducedMotion(motionQuery.matches);
    }
    mql.addEventListener("change", onChange)
    motionQuery.addEventListener("change", onMotionChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    setReducedMotion(motionQuery.matches);
    return () => {
      mql.removeEventListener("change", onChange)
      motionQuery.removeEventListener("change", onMotionChange)
    }
  }, [])

  return { isMobile: !!isMobile, reducedMotion };
}
