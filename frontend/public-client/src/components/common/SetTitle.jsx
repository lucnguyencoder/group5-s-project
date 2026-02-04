//done
import { useEffect } from 'react';

export default function SetTitle({ title }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
}
