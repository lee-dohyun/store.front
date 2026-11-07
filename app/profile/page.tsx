import { pageMetadata } from "@/lib/site";
import ProfileForm from "./ProfileForm";

// 로그인 사용자 정보를 브라우저에서 불러오므로 화면은 ProfileForm 에 두고, 메타데이터만 서버에서 낸다(store.front#103).
// 색인 차단(noindex)은 비공개 영역 색인 차단 작업(lee-dohyun/gateway#370) 범위라 여기서 넣지 않는다.
export const metadata = pageMetadata({ title: "내 정보", path: "/profile" });

export default function ProfilePage() {
  return <ProfileForm />;
}
