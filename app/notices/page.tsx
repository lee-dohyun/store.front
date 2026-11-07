import { pageMetadata } from "@/lib/site";
import NoticesList from "./NoticesList";

// 목록 페이지네이션이 client 상태라 화면은 NoticesList 에 두고, 메타데이터만 서버에서 낸다(store.front#103).
export const metadata = pageMetadata({
  title: "공지사항",
  description: "PosSelect 공지사항 — 배송·점검·약관 변경 안내",
  path: "/notices",
});

export default function NoticesPage() {
  return <NoticesList />;
}
