import { useState } from "react";
import { cn } from "../../lib/cn";

export function Switch({ defaultChecked = false, checked: controlledChecked, onChange, className }) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked;

  function toggle() {
    const next = !isChecked;
    if (controlledChecked === undefined) {
      setInternalChecked(next);
    }
    onChange?.(next);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      onClick={toggle}
      className={cn(
        "relative inline-flex h-5.5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-lime focus-visible:ring-offset-2",
        isChecked ? "bg-fg" : "bg-border",
        className
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-bg shadow-md ring-0 transition duration-200 ease-in-out",
          isChecked ? "translate-x-4.5" : "translate-x-0"
        )}
      />
    </button>
  );
}