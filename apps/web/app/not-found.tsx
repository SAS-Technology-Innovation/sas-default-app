import Link from "next/link"
import { Button } from "@workspace/ui/components/button"

export default function NotFound() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="max-w-md space-y-4 text-center">
        <h2 className="text-2xl font-semibold">Page not found</h2>
        <p className="text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  )
}
