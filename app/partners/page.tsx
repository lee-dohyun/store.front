import { pageMetadata } from "@/lib/site";
import PartnerInquiryForm from "./PartnerInquiryForm";

// 폼 제출이 client 이벤트라 화면은 PartnerInquiryForm 에 두고, 메타데이터만 서버에서 낸다(store.front#103).
export const metadata = pageMetadata({ title: "입점 문의", path: "/partners" });

export default function PartnersPage() {
  return <PartnerInquiryForm />;
}
