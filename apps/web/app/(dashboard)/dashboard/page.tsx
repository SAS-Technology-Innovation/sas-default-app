import { requireAuth } from "@/lib/auth-guard"

export default async function DashboardPage() {
  const session = await requireAuth()

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p>
          Welcome back, <strong>{session.user?.name ?? "User"}</strong>
        </p>
        <p className="text-muted-foreground">
          This is a protected route. Only authenticated users can see this page.
        </p>
      </div>
    </div>
  )
}
