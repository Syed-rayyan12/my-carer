"use client";

import { useCallback, useEffect, useState } from 'react';

/** Success feedback belongs to one explicit action on one page. */
export function useSaveNotice(scope: string) {
  const [value, setValue] = useState({ scope, message: '' });
  // Discard the previous page's action before its feedback can render again,
  // including when navigating back to that page.
  if (value.scope !== scope) setValue({ scope, message: '' });

  const setNotice = useCallback((message: string) => {
    setValue({ scope, message });
  }, [scope]);

  useEffect(() => {
    if (!value.message) return;
    // Let the toast finish its exit animation, then clear the source state too.
    const timer = setTimeout(() => {
      setValue(current => current === value ? { scope: current.scope, message: '' } : current);
    }, 5000);
    return () => clearTimeout(timer);
  }, [value]);

  return { notice: value.scope === scope ? value.message : '', setNotice };
}
