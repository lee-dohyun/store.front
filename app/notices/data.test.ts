import { describe, expect, it } from "vitest";
import { getNoticeById, getNotices } from "./data";

describe("getNotices", () => {
  it("최신 날짜(date) 순으로 내림차순 정렬해서 반환한다", () => {
    const notices = getNotices();
    const dates = notices.map((n) => n.date);
    const sortedDatesDesc = [...dates].sort((a, b) => (a < b ? 1 : -1));
    expect(dates).toEqual(sortedDatesDesc);
    expect(notices[0].date >= notices[notices.length - 1].date).toBe(true);
  });

  it("원본 배열을 변경하지 않고 매 호출마다 새 배열을 반환한다", () => {
    const first = getNotices();
    const second = getNotices();
    expect(first).not.toBe(second);
    expect(first).toEqual(second);
  });

  it("정적 데이터 전체 개수를 그대로 반환한다", () => {
    expect(getNotices()).toHaveLength(9);
  });
});

describe("getNoticeById", () => {
  it("존재하는 id로 조회하면 해당 공지사항을 반환한다", () => {
    const notice = getNoticeById(1);
    expect(notice).toBeDefined();
    expect(notice?.id).toBe(1);
    expect(notice?.title).toBe("PosSelect 서비스를 시작합니다");
  });

  it("존재하지 않는 id로 조회하면 undefined를 반환한다", () => {
    expect(getNoticeById(9999)).toBeUndefined();
  });
});
