import { useState } from 'react';

interface FaviconProps {
  src?: string;
}

/** A tab's icon, falling back to a grey placeholder if it's missing or fails to load. */
export function Favicon({ src }: FaviconProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <div className="favicon placeholder" />;
  }
  return (
    <img className="favicon" src={src} alt="" onError={() => setFailed(true)} />
  );
}
