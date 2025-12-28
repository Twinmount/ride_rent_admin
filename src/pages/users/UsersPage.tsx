"use client";

import { UserList } from "./UserList";

export default function UsersPage() {
  return (
    <main className="flex-1 p-6">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              User Management
            </h1>
            <p className="text-muted-foreground">
              View and manage all registered users.
            </p>
          </div>
        </div>

        {/* User Table */}
        <UserList />
      </div>
    </main>
  );
}
