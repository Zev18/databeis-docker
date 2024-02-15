import { useEffect, useRef } from "react";

type Config = {
  timeout: number;
  ignoreInitialCall?: boolean;
};

const DEFAULT_CONFIG = {
  timeout: 0,
  ignoreInitialCall: true,
};
export function useDebouncedEffect(
  callback: any,
  config: Config,
  deps: any[] = [],
) {
  let currentConfig;
  if (typeof config === "object") {
    currentConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    };
  } else {
    currentConfig = {
      ...DEFAULT_CONFIG,
      timeout: config,
    };
  }
  const { timeout, ignoreInitialCall } = currentConfig;
  const data = useRef<{ firstTime: boolean; clearFunc?: any }>({
    firstTime: true,
  });
  useEffect(() => {
    const { firstTime, clearFunc } = data.current;

    if (firstTime && ignoreInitialCall) {
      data.current.firstTime = false;
      return;
    }

    const handler = setTimeout(() => {
      if (clearFunc && typeof clearFunc === "function") {
        clearFunc();
      }
      data.current.clearFunc = callback();
    }, timeout);

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeout, ...deps]);
}

export default useDebouncedEffect;
