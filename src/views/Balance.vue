<template>
  <div class="container">
    <div class="page-header">
      <h3 class="page-title">🏃‍➡️ 협곡 팀 짜기 🏃</h3>
      <p class="description">정확하지 않을 수도 있습니다.<br/> 약간의 조정이 필요할 수 있습니다.</p>
    </div>
    <div class="team-list" :class="{even: teams.length % 2 === 0}">
      <div class="team-list__item" v-for="(team, index) in teams" :key="index">
        <div class="team-list__item__header">
          <h5>🤝 {{ index + 1 }}팀 🤝</h5>
          <p>총 포인트: {{ Math.floor(team.totalPoint) }}</p>
        </div>
        <ul>
          <li v-for="(mem, index) in team.members" :key="index">
            ✌️ {{ mem.name }} ({{ mem?.visibleTier?.value }}) 🫶
          </li>
        </ul>
      </div>
    </div>
    <div class="button-group">
      <button @click="back" class="modu-button">뒤로</button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMemberStore } from '@/stores/memberStore';
import type { IMember } from '@/types/Member';
import router from '@/router';

/* \
|*|----------------------------------------------------------------------------
|*| 인터페이스
|*|----------------------------------------------------------------------------
\ */
type Team = {
  members: IMember[];
  totalPoint: number;
};

/* \
|*|----------------------------------------------------------------------------
|*| 공통참조
|*|----------------------------------------------------------------------------
\ */
const memberStore = useMemberStore();

/* \
|*|----------------------------------------------------------------------------
|*| 일반참조
|*|----------------------------------------------------------------------------
\ */
const memberList = ref<IMember[]>([]);
const teams = ref<Team[]>([]);

/* \
|*|----------------------------------------------------------------------------
|*| 함수(이벤트)
|*|----------------------------------------------------------------------------
\ */
function createBalancedTeams(memberList: any[]): { teams: any[] } {
  const positions = ['T', 'J', 'M', 'A', 'S'];
  const teamCount = Math.floor(memberList.length / 5);
  const teams = Array.from({ length: teamCount }, () => ({ members: [], totalPoint: 0 }));

  // 멤버를 포인트 기준으로 내림차순 정렬
  const sortedMembers = [...memberList].sort((a, b) => b.point - a.point);

  // 포지션별 멤버 분류
  const positionGroups: Record<string, any[]> = positions.reduce((acc, pos) => {
    acc[pos] = [];
    return acc;
  }, {});
  const allPositionMembers: any[] = [];

  sortedMembers.forEach((member) => {
    const primaryPosition = member.position[0]?.value;
    if (primaryPosition === 'ALL') {
      allPositionMembers.push(member);
    } else {
      const secondaryPosition = member.position[1]?.value;
      if (positions.includes(primaryPosition)) {
        positionGroups[primaryPosition].push(member);
      } else if (positions.includes(secondaryPosition)) {
        positionGroups[secondaryPosition].push(member);
      }
    }
  });

  // 팀 배정
  positions.forEach((position) => {
    const members = positionGroups[position];
    members.forEach((member: IMember) => {
      const targetTeam: Team = teams.sort((a, b) => a.members.length - b.members.length || a.totalPoint - b.totalPoint)[0];
      if (targetTeam.members.length < 5) {
        member.resultPosition = position;
        targetTeam.members.push(member);
        targetTeam.totalPoint += member.point;
      }
    });
  });

  // ALL 포지션 멤버 배정
  allPositionMembers.forEach((member: IMember) => {
    const targetTeam: Team = teams.sort((a, b) => a.members.length - b.members.length || a.totalPoint - b.totalPoint)[0];
    if (targetTeam.members.length < 5) {
      member.resultPosition = 'ALL';
      targetTeam.members.push(member);
      targetTeam.totalPoint += member.point;
    }
  });

  // 누락된 멤버 확인 및 추가
  sortedMembers.forEach((member) => {
    if (!teams.some((team: Team) => team.members.includes(member))) {
      const targetTeam: Team = teams.sort((a, b) => a.members.length - b.members.length || a.totalPoint - b.totalPoint)[0];
      if (targetTeam.members.length < 5) {
        member.resultPosition = positions.find(
          (pos) => !targetTeam.members.some((m: IMember) => m?.resultPosition === pos),
        ) || 'ALL';
        targetTeam.members.push(member);
        targetTeam.totalPoint += member.point;
      }
    }
  });

  // 팀 멤��� 정렬
  teams.forEach((team) => {
    team.members.sort((a: IMember, b: IMember) => positions.indexOf(a?.resultPosition) - positions.indexOf(b?.resultPosition));
  });

  return { teams };
}

const back = () => {
  router.back();
};

/* \
|*|----------------------------------------------------------------------------
|*| 최초 세팅
|*|----------------------------------------------------------------------------
\ */
onMounted(() => {
  // 초기화

  memberList.value = memberStore.members;
  console.log('memberList', memberList.value);
  teams.value = createBalancedTeams(memberList.value)?.teams;
  console.log('teams', teams.value);
});
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .page-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.6rem;
    margin-bottom: 2rem;

    .page-title {
      font-size: 2rem;
      font-weight: bold;
      text-align: center;
    }
  }

  .team-list {
    width: 700px;
    display: flex;
    gap: 2rem;
    margin-bottom: 1rem;

    h5 {
      margin: 0;
      font-size: 1.2rem;
      font-weight: bold;
    }

    p {
      margin: 0;
      font-size: 1rem;
      color: #666;
    }

    ul {
      list-style-type: none;
      padding-left: 0;

      li {
        margin-bottom: 0.5rem;
        font-size: 1rem;
        color: #333;
      }
    }

    &__item {
      width: calc(33.33% - 1.8rem);
      padding: 1rem;
      box-sizing: border-box;
      border: 1px solid #E8BD55;
      background: #F2F0F2;

      .team-list__item__header {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        align-items: center;
        margin-bottom: 0.8rem;

        h5 {
          color: #BF5B04;
        }
        p {
          color: #70AE86;
        }
      }
    }

    &.even {
      .team-list__item {
        width: calc(50% - 1rem);
        text-align: center;
      }
    }

  }
}
</style>
