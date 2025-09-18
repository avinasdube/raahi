import { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  asTag = "div",
  delay = 0,
  className = "",
  once = true,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once]);

  const base = "transition-all duration-700 will-change-transform";
  const hidden = "opacity-0 translate-y-4";
  const shown = "opacity-100 translate-y-0";

  const TagName = asTag;
  return (
    <TagName
      ref={ref}
      className={`${base} ${visible ? shown : hidden} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </TagName>
  );
}
