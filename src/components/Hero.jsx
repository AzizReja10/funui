import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

export function Hero() {
  return (
    <div className="border-b border-border pb-10">
      <Badge variant="accent">Five components so far</Badge>
      <h1 className="mt-4 max-w-xl font-heading text-4xl font-semibold leading-tight text-fg">
        Components you copy, not a library you install.
      </h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
        Forma UI is a small set of React components with Tailwind styling.
        Open a component, copy the code into your project, and change
        whatever you want — there's no package to update.
      </p>
      <div className="mt-6 flex gap-3">
        <Button
          variant="default"
          onClick={() => document.getElementById("button")?.scrollIntoView({ behavior: "smooth" })}
        >
          Browse components
        </Button>
        <Button
          variant="outline"
          onClick={() => window.open("https://github.com", "_blank", "noopener,noreferrer")}
        >
          View on GitHub
        </Button>
      </div>
    </div>
  );
}