import { isBrowser } from "@/lib/utils";
import { useEffect, useLayoutEffect } from "react";

const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
