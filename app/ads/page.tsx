import { pageMetadata } from "@/lib/site";
import AdsInquiryForm from "./AdsInquiryForm";

// 폼 제출이 client 이벤트라 화면은 AdsInquiryForm 에 두고, 메타데이터만 서버에서 낸다(store.front#103).
export const metadata = pageMetadata({ title: "광고 문의", path: "/ads" });

export default function AdsPage() {
  return <AdsInquiryForm />;
}
