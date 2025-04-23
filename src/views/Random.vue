<template>
  <div class="container">
    <div class="page-header">
      <h3 class="page-title">🌬️️ 칼바람 팀 짜기 ❄️</h3>
    </div>
    <div class="team-list" :class="{even: teams.length % 2 === 0}">
      <div class="team-list__item" v-for="(team, index) in teams" :key="index">
        <div class="team-list__item__header">
          <h5>🐾 {{ index + 1 }}팀 🐾</h5>
        </div>
        <ul>
          <li v-for="(mem, index) in team.members" :key="index">
            🐠 {{ mem.name }} ({{ mem?.visibleTier?.value }}) 🐟
          </li>
        </ul>
      </div>
    </div>
    <div class="button-group">
      <button @click="back" class="modu-button">뒤로</button>
      <button @click="reTryTeam" class="modu-button">다시 돌리기</button>
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
function shuffleArray(array: any[]): any[] {
  return array
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function createRandomTeams(memberList: any[]): { teams: any[] } {
  const shuffledMembers = shuffleArray(memberList);
  const teams = [];

  for (let i = 0; i < shuffledMembers.length; i += 5) {
    const team = shuffledMembers.slice(i, i + 5);
    if (team.length === 5) {
      teams.push({ members: team });
    }
  }

  return { teams };
}

const back = () => {
  router.back();
};

const fisherYatesShuffle = (array: IMember[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const reTryTeam = () => {
  const shuffledMembers = fisherYatesShuffle(memberList.value);
  teams.value = createRandomTeams(shuffledMembers)?.teams;
};

/* \
|*|----------------------------------------------------------------------------
|*| 최초 세팅
|*|----------------------------------------------------------------------------
\ */
onMounted(() => {
  // 초기화\
  memberList.value = memberStore.members;
  teams.value = createRandomTeams(memberList.value)?.teams;
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
      border: 1px solid #0378A6;
      background: #F2F0F2;

      .team-list__item__header {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        align-items: center;
        margin-bottom: 0.8rem;

        h5 {
          color: #0378A6;
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
