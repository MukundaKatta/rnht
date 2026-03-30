"use client";

import { openExternal } from "@/lib/capacitor";

type ExternalLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

/**
 * A link component that opens URLs in the system browser on native (Capacitor),
 * and in a new tab on web. Use this for ALL external links (WhatsApp, social media,
 * Google Calendar, etc.) to prevent them from opening inside the WebView.
 */
export function ExternalLink({ href, children, onClick, ...props }: ExternalLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    openExternal(href);
    onClick?.(e);
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
