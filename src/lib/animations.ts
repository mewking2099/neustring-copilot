import type { Variants } from "framer-motion"

export const springSnappy = { type: "spring" as const, stiffness: 400, damping: 17 }
export const springSmooth = { type: "spring" as const, stiffness: 400, damping: 20 }

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
}
