// src/components/skeletons/Skeleton.tsx

// ─── Base Skeleton Component ──────────────────────────────────────────────────

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 ${className}`}
      aria-live="polite"
      aria-busy="true"
    />
  );
}

// ─── Reusable Skeleton Parts ──────────────────────────────────────────────────

export function AvatarSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-32 w-32',
  };
  return <Skeleton className={`${sizes[size]} rounded-full`} />;
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${
            i === lines - 1 ? 'w-2/3' : i === lines - 2 ? 'w-5/6' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
}

export function ButtonSkeleton({ className = '' }: { className?: string }) {
  return <Skeleton className={`h-10 w-24 ${className}`} />;
}

export function CardSkeleton({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg bg-white p-4 shadow-sm">{children}</div>;
}

// ─── Navigation Skeleton ──────────────────────────────────────────────────────

export function NavbarSkeleton() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="hidden h-6 w-24 sm:block" />
          </div>

          {/* Search */}
          <div className="hidden max-w-md flex-1 px-8 md:block">
            <Skeleton className="h-10 w-full rounded-full" />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-lg" />
            ))}
            <AvatarSkeleton size="sm" />
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── Feed Skeletons ───────────────────────────────────────────────────────────

export function PostSkeleton() {
  return (
    <CardSkeleton>
      {/* Header */}
      <div className="flex items-center space-x-3">
        <AvatarSkeleton />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>

      {/* Content */}
      <div className="mt-4">
        <TextSkeleton lines={3} />
      </div>

      {/* Image placeholder */}
      <Skeleton className="mt-4 h-64 w-full rounded-lg" />

      {/* Engagement stats */}
      <div className="mt-4 flex items-center justify-between border-t pt-3 text-sm">
        <Skeleton className="h-4 w-20" />
        <div className="flex space-x-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-3 flex space-x-2 border-t pt-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 flex-1 rounded-lg" />
        ))}
      </div>
    </CardSkeleton>
  );
}

export function CreatePostSkeleton() {
  return (
    <CardSkeleton>
      <div className="flex items-center space-x-3">
        <AvatarSkeleton />
        <Skeleton className="h-12 flex-1 rounded-full" />
      </div>
      <div className="mt-3 flex items-center justify-between border-t pt-3">
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>
    </CardSkeleton>
  );
}

export function FeedSkeleton() {
  return (
    <div className="space-y-4">
      <CreatePostSkeleton />
      <div className="rounded-lg bg-white p-2 shadow-sm">
        <div className="flex space-x-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 flex-1 rounded-lg" />
          ))}
        </div>
      </div>
      {[1, 2, 3].map((i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
}

// ─── Profile Skeletons ────────────────────────────────────────────────────────

export function ProfileHeaderSkeleton() {
  return (
    <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm">
      {/* Cover */}
      <Skeleton className="h-48 w-full rounded-none" />

      {/* Profile Info */}
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="absolute -top-16 left-6">
          <AvatarSkeleton size="lg" />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4">
          <ButtonSkeleton className="w-28" />
          <ButtonSkeleton className="w-32" />
        </div>

        {/* User Info */}
        <div className="mt-4 space-y-3">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <TextSkeleton lines={2} />

          {/* Stats */}
          <div className="mt-4 flex gap-6 border-t pt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileTabsSkeleton() {
  return (
    <CardSkeleton>
      {/* Tabs */}
      <div className="flex border-b">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="mr-4 h-10 w-24" />
        ))}
      </div>

      {/* Content */}
      <div className="mt-6 space-y-6">
        <div>
          <Skeleton className="mb-3 h-5 w-24" />
          <TextSkeleton lines={3} />
        </div>
        <div>
          <Skeleton className="mb-3 h-5 w-24" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </CardSkeleton>
  );
}

export function ProfileSkeleton() {
  return (
    <div>
      <ProfileHeaderSkeleton />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProfileTabsSkeleton />
        </div>
        <div>
          <SidebarSkeleton />
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar Skeletons ────────────────────────────────────────────────────────

export function SidebarSkeleton() {
  return (
    <div className="space-y-4">
      {/* Profile Card */}
      <CardSkeleton>
        <div className="text-center">
          <div className="flex justify-center">
            <AvatarSkeleton />
          </div>
          <Skeleton className="mx-auto mt-2 h-5 w-32" />
          <Skeleton className="mx-auto mt-1 h-4 w-24" />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Skeleton className="mx-auto h-5 w-12" />
              <Skeleton className="mx-auto h-3 w-16" />
            </div>
            <div className="space-y-1">
              <Skeleton className="mx-auto h-5 w-12" />
              <Skeleton className="mx-auto h-3 w-16" />
            </div>
          </div>
          <Skeleton className="mx-auto mt-3 h-10 w-full rounded-lg" />
        </div>
      </CardSkeleton>

      {/* Quick Links */}
      <CardSkeleton>
        <Skeleton className="mb-3 h-5 w-32" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      </CardSkeleton>

      {/* Trending */}
      <CardSkeleton>
        <Skeleton className="mb-3 h-5 w-32" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
          ))}
        </div>
      </CardSkeleton>
    </div>
  );
}

// ─── Marketplace Skeletons ────────────────────────────────────────────────────

export function MarketplaceItemSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-lg">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-4 w-4" />
          ))}
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex items-baseline space-x-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

export function MarketplaceSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <MarketplaceItemSkeleton key={i} />
      ))}
    </div>
  );
}

export function MarketplaceFiltersskeleton() {
  return (
    <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
      <div>
        <Skeleton className="mb-3 h-5 w-32" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="ml-2 h-4 w-24" />
              </div>
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </div>
      </div>
      <div>
        <Skeleton className="mb-3 h-5 w-32" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-10 flex-1 rounded-lg" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-10 flex-1 rounded-lg" />
        </div>
        <Skeleton className="mt-3 h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

// ─── Messages Skeletons ───────────────────────────────────────────────────────

export function ConversationItemSkeleton() {
  return (
    <div className="flex items-start space-x-3 border-b p-4">
      <AvatarSkeleton />
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}

export function MessagesSkeleton() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-80 border-r bg-white">
        <div className="border-b p-4">
          <Skeleton className="h-10 w-full rounded-full" />
        </div>
        <div>
          {[1, 2, 3, 4, 5].map((i) => (
            <ConversationItemSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-white px-6 py-4">
          <div className="flex items-center space-x-3">
            <AvatarSkeleton />
            <div className="space-y-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="flex space-x-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 p-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}
            >
              <Skeleton className="h-16 w-64 rounded-2xl" />
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t bg-white p-4">
          <div className="flex items-center space-x-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-10 w-10 rounded-lg" />
            ))}
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Notifications Skeletons ──────────────────────────────────────────────────

export function NotificationItemSkeleton() {
  return (
    <div className="flex items-start space-x-3 border-b p-4">
      <AvatarSkeleton size="sm" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function NotificationsSkeleton() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 rounded-lg bg-white p-4 shadow-sm">
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="rounded-lg bg-white shadow-sm">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <NotificationItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// ─── Onboarding Skeleton ──────────────────────────────────────────────────────

export function OnboardingSkeleton() {
  return (
    <div className="w-full max-w-2xl">
      <div className="mb-8 text-center">
        <Skeleton className="mx-auto mb-4 h-10 w-64" />
        <Skeleton className="mx-auto h-5 w-48" />
      </div>

      <CardSkeleton>
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          ))}
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </CardSkeleton>
    </div>
  );
}

// ─── Full Page Skeletons ──────────────────────────────────────────────────────

export function PageSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarSkeleton />
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-8">{children}</div>
    </div>
  );
}

export function FeedPageSkeleton() {
  return (
    <PageSkeleton>
      <div className="grid gap-6 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-20">
            <SidebarSkeleton />
          </div>
        </aside>
        <main className="lg:col-span-6">
          <FeedSkeleton />
        </main>
        <aside className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-20">
            <SidebarSkeleton />
          </div>
        </aside>
      </div>
    </PageSkeleton>
  );
}

export function MarketplacePageSkeleton() {
  return (
    <PageSkeleton>
      <div className="grid gap-6 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <div className="sticky top-20">
            <MarketplaceFilterskeleton />
          </div>
        </aside>
        <div className="lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
          <MarketplaceSkeleton />
        </div>
      </div>
    </PageSkeleton>
  );
}

export function ProfilePageSkeleton() {
  return (
    <PageSkeleton>
      <ProfileSkeleton />
    </PageSkeleton>
  );
}

export function MessagesPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarSkeleton />
      <div className="pt-16">
        <MessagesSkeleton />
      </div>
    </div>
  );
}

export function NotificationsPageSkeleton() {
  return (
    <PageSkeleton>
      <NotificationsSkeleton />
    </PageSkeleton>
  );
}
