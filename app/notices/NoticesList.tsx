"use client";

import { useState } from "react";
import Link from "next/link";
import { Pagination } from "@posselect/ui";
import { getNotices } from "./data";

const PAGE_SIZE = 5;

export default function NoticesList() {
  const notices = getNotices();
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(notices.length / PAGE_SIZE));
  const pageItems = notices.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <main
      style={{
        minHeight: "60vh",
        background: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 96px" }}>
        <h1 style={{ marginBottom: 32 }}>공지사항</h1>

        {notices.length === 0 ? (
          <p className="text-muted" style={{ fontSize: 14 }}>
            등록된 공지사항이 없습니다.
          </p>
        ) : (
          <>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column" }}>
              {pageItems.map((notice) => (
                <li key={notice.id} style={{ borderBottom: "1px solid var(--color-divider)" }}>
                  <Link
                    href={`/notices/${notice.id}`}
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 12,
                      padding: "16px 4px",
                      color: "inherit",
                      textDecoration: "none",
                    }}
                  >
                    <span
                      className="tag"
                      style={{ flexShrink: 0, fontSize: 11 }}
                    >
                      {notice.category}
                    </span>
                    <span style={{ flex: 1, minWidth: 0, fontSize: 14 }}>{notice.title}</span>
                    <span className="text-muted" style={{ flexShrink: 0, fontSize: 12 }}>
                      {notice.date}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <div style={{ marginTop: 32 }}>
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
