"use client";

import React from "react";
import Image from "next/image";
import {
  TableView,
  TableHeader,
  Column,
  TableBody,
  Row,
  Cell,
} from "@react-spectrum/s2/TableView";
import { Badge } from "@react-spectrum/s2/Badge";
import { Button } from "@react-spectrum/s2/Button";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import type { ManagedUser, UserManagementOptions } from "../../types";
import { formatDate, initials } from "../../utils";

interface UserTableProps {
  users: ManagedUser[];
  options: UserManagementOptions | null;
  isLoading: boolean;
  isRoot: boolean;
  onOpenUser: (user: ManagedUser) => void;
}

export function UserTable({
  users,
  options,
  isLoading,
  isRoot,
  onOpenUser,
}: UserTableProps) {
  return (
    <div className="hidden min-h-0 flex-1 max-w-full overflow-hidden md:block">
      <TableView
        aria-label="Tabel Pengguna"
        density="spacious"
        styles={style({ width: "full", minHeight: 280 })}
      >
        <TableHeader>
          <Column id="name" isRowHeader width="2.5fr" minWidth={200}>
            Nama
          </Column>
          <Column id="username" width="1.5fr" minWidth={140}>
            Username
          </Column>
          <Column id="roles" width="3fr" minWidth={220}>
            Peran & Izin
          </Column>
          <Column id="created_at" width="1.5fr" minWidth={130}>
            Bergabung
          </Column>
          <Column id="actions" width="1fr" minWidth={90} align="end">
            Aksi
          </Column>
        </TableHeader>

        <TableBody
          items={users}
          renderEmptyState={() => (
            <div className="flex h-40 items-center justify-center text-sm text-cu-muted">
              {isLoading
                ? "Memuat data pengguna..."
                : "Tidak ada pengguna yang sesuai."}
            </div>
          )}
        >
          {(user: ManagedUser) => {
            const protectedFromManager = !isRoot && user.roles.includes("Root");

            return (
              <Row id={String(user.id)} key={user.id}>
                {/* Kolom Nama */}
                <Cell textValue={user.name}>
                  <div className="flex items-center gap-3 py-1">
                    <Avatar user={user} />
                    <div className="min-w-0">
                      <span className="block truncate font-semibold text-cu-ink">
                        {user.name}
                      </span>
                      <span className="text-xs text-cu-muted">ID #{user.id}</span>
                    </div>
                  </div>
                </Cell>

                {/* Kolom Username */}
                <Cell textValue={user.username}>
                  <span className="font-medium text-cu-ink">
                    @{user.username}
                  </span>
                </Cell>

                {/* Kolom Peran & Izin */}
                <Cell textValue={user.roles.join(", ")}>
                  <div className="flex flex-wrap items-center gap-1.5 py-1">
                    {user.roles.map((role) => (
                      <Badge
                        key={role}
                        size="S"
                        variant={
                          role === "Root"
                            ? "negative"
                            : role === "Manajer"
                            ? "informative"
                            : "neutral"
                        }
                      >
                        {role}
                      </Badge>
                    ))}
                    {user.permissions.slice(0, 2).map((permission) => (
                      <Badge key={permission} size="S" variant="gray">
                        +{options?.permission_aliases[permission] ?? permission}
                      </Badge>
                    ))}
                    {user.permissions.length > 2 && (
                      <Badge size="S" variant="gray">
                        +{user.permissions.length - 2} lagi
                      </Badge>
                    )}
                  </div>
                </Cell>

                {/* Kolom Bergabung */}
                <Cell textValue={formatDate(user.created_at)}>
                  <span className="text-xs text-cu-muted">
                    {formatDate(user.created_at)}
                  </span>
                </Cell>

                {/* Kolom Aksi */}
                <Cell textValue="Aksi">
                  <div className="flex items-center justify-end py-1">
                    {protectedFromManager ? (
                      <span className="text-xs italic text-cu-muted">
                        Protected
                      </span>
                    ) : (
                      <Button
                        size="S"
                        variant="secondary"
                        onPress={() => onOpenUser(user)}
                      >
                        Kelola
                      </Button>
                    )}
                  </div>
                </Cell>
              </Row>
            );
          }}
        </TableBody>
      </TableView>
    </div>
  );
}

function Avatar({ user }: { user: ManagedUser }) {
  return (
    <div
      className={`flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-cu-line ${
        user.avatar_url ? "bg-white" : "bg-cu-panel-soft"
      }`}
    >
      {user.avatar_url ? (
        <Image
          unoptimized
          width={36}
          height={36}
          src={user.avatar_url}
          alt={user.name}
          className="size-full object-cover"
        />
      ) : (
        <span className="text-xs font-bold text-cu-muted">
          {initials(user.name)}
        </span>
      )}
    </div>
  );
}
