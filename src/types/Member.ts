/**
 * 멤버
 */
export interface IMember {
  name: string; /* 멤버 이름 */
  position1: string; /* 멤버 1지망 포지션 */
  position2: string; /* 멤버 2지망 포지션 */
  visibleTier: string; /* 보여지는 멤버 등급 */
  tier: string; /* 실질적 멤버 등급 */
  point: number; /* 포인트 */
}
