import { useEffect, useState } from "react";

const useTrackedState = <T extends object>(callback: () => T, factor: T) => {
  const [state, setState] = useState<T>(callback());

  useEffect(() => {
    const newState = callback();
    if (JSON.stringify(newState) !== JSON.stringify(state)) {
      setState(newState);
      
    }
  }, [factor]);

  return [state, setState] as const;
};

export default useTrackedState;