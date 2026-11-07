import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/site";
import { getNoticeById } from "../data";

type Props = { params: Promise<{ id: string }> };

function findNotice(rawId: string) {
  const id = Number(rawId);
  return Number.isFinite(id) ? getNoticeById(id) : undefined;
}

// 서버 컴포넌트로 바꿔 공지 제목을 <title>·canonical 로 낸다(store.front#103). 본문은 원래도 서버 HTML 에 있었다.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const notice = findNotice(id);
  // 없는 공지에는 canonical 을 내지 않는다 — 없는 주소를 대표 주소로 신고하지 않기 위해서다.
  if (!notice) return { title: "공지사항을 찾을 수 없습니다" };
  return pageMetadata({
    title: notice.title,
    description: notice.body.split("\n")[0].slice(0, 120),
    path: `/notices/${notice.id}`,
  });
}

export default async function NoticeDetailPage({ params }: Props) {
  const { id } = await params;
  const notice = findNotice(id);

  if (!notice) {
    return (
      <main
        style={{
          minHeight: "60vh",
          background: "var(--color-bg)",
          color: "var(--color-text)",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 96px" }}>
          <p className="text-muted" style={{ fontSize: 14, marginBottom: 24 }}>
            공지사항을 찾을 수 없습니다.
          </p>
          <Link href="/notices">목록으로 돌아가기</Link>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "60vh",
        background: "var(--color-bg)",
        color: "var(--color-text)",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 96px" }}>
        <span className="tag" style={{ fontSize: 11, marginBottom: 12, display: "inline-flex" }}>
          {notice.category}
        </span>
        <h1 style={{ marginBottom: 8 }}>{notice.title}</h1>
        <p className="text-muted" style={{ fontSize: 13, marginBottom: 32 }}>
          {notice.date}
        </p>

        <p style={{ whiteSpace: "pre-line", fontSize: 14, opacity: 0.88, lineHeight: 1.7 }}>
          {notice.body}
        </p>

        <hr className="hr" style={{ margin: "40px 0" }} />

        <Link href="/notices">목록으로 돌아가기</Link>
      </div>
    </main>
  );
}
