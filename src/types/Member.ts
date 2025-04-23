/**
 * 멤버
 */
export interface Select {
  name: string;
  value: string;
}

export interface IMember {
  name: string; /* 멤버 이름 */
  position: Select[]; /* 멤버 포지션 */
  visibleTier: Select | null; /* 보여지는 멤버 등급 */
  tier: Select | null; /* 실질적 멤버 등급 */
  point: number; /* 포인트 */
  resultPosition?: string; /* 결과 포지션 */
}
