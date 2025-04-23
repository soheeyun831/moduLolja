<template>
  <div class="home-container">
    <img src="@/assets/images/logo.png" alt="로고" class="logo"/>
    <ul class="form-group">
      <li class="form-group__item">
        <h3 class="form-title">종류 세팅</h3>
        <div class="check-button-group">
          <button class="modu-button check-type"
                  @click="setCurrentType('random')"
                  :class="{'is-active': isType ==='random'}"
                  :disabled="isStep !== 1">
            칼바람 랜덤
          </button>
          <button class="modu-button check-type"
                  @click="setCurrentType('balance')"
                  :class="{'is-active': isType ==='balance'}"
                  :disabled="isStep !== 1">
            협곡
            팀짜기
          </button>
          <button class="modu-button check-type"
                  @click="setCurrentType('gift')"
                  :class="{'is-active': isType ==='gift'}"
                  :disabled="isStep !== 1">
            무작위 상품 뿌리기
          </button>
        </div>
      </li>
      <li v-if="isStep > 1" class="form-group__item">
        <h3 class="form-title">멤버 세팅</h3>
        <div v-if="isStep === 2" class="add-input-group">
          <input v-model="inputValue" class="modu-input" @keydown.enter="addMember"
                 maxlength="4"/>
          <button class="modu-button small" @click="addMember"
                  :disabled="!inputValue || inputValue === ''">추가
          </button>
          <button class="modu-button small" @click="resetMemberList">초기화</button>
        </div>
        <div v-if="memberList.length" class="member-container">
          <h5>현재 멤버 ({{ memberList.length }} 명)</h5>
          <ul class="member-list" :class="{'only-name' : isType !== 'balance'}">
            <li v-for="(mem, key) in memberList" :key="key" class="member-list__items">
              <span class="member-name">🧑 {{ mem.name }}</span>
              <template v-if="isType === 'balance'">
                <multiselect v-model="mem.position" :options="positionData" placeholder="포지션" track-by="name"
                             multiple :searchable="false" :max="2"
                             label="name" :show-labels="false" class="modu-select long">
                  <template #maxElements>
                    2개까지만 선택 가능
                  </template>
                </multiselect>
                <multiselect v-model="mem.tier" :options="visibleTierData" placeholder="실제 티어" track-by="name"
                             label="name" :show-labels="false" class="modu-select"/>
                <multiselect v-model="mem.visibleTier" :options="visibleTierData" placeholder="현재 티어" track-by="name"
                             label="name" :show-labels="false" class="modu-select"/>
              </template>
              <button v-if="isStep === 2" class="text-button" @click="memberList.splice(key, 1)">❎</button>
            </li>
          </ul>
          <p v-if="isType === 'balance' && isStep === 2" class="description">
            *
            첫번째 티어 선택에는 현재 티어가 아닌 판단된 실력으로 적으시면 됩니다.<br/>
            두번째 티어 선택은 마지막 노출될 티어입니다.
          </p>
        </div>
      </li>
      <li v-if="isStep > 2 && isType === 'gift'" class="form-group__item">
        <h3 class="form-title">상품</h3>
        <div class="check-button-group">
          <button class="modu-button check-type" @click="setGameType('ladder')"
                  :class="{'is-active': isGameType ==='ladder'}">사다리 타기
          </button>
          <button class="modu-button check-type" @click="setGameType('negative')"
                  :class="{'is-active': isGameType ==='negative'}">원판 굴리기
          </button>
        </div>
      </li>
      <li v-if="isStep > 3 && isType === 'gift'" class="form-group__item">
        <h3 class="form-title">게임 타입</h3>
        <div class="check-button-group">
          <button class="modu-button check-type" @click="setGameType('ladder')"
                  :class="{'is-active': isGameType ==='ladder'}">사다리 타기
          </button>
          <button class="modu-button check-type" @click="setGameType('negative')"
                  :class="{'is-active': isGameType ==='negative'}">원판 굴리기
          </button>
        </div>
      </li>
      <li class="form-group__item button-group">
        <button v-if="isStep !== 1" class="modu-button" @click="prevForm">이전</button>
        <button v-if="isStep < 4 && isType ==='gift'" class="modu-button" @click="nextForm"
                :disabled="isStep !== 1 && !memberList.length">다음
        </button>
        <button v-else-if="isStep < 2 && isType !=='gift'" class="modu-button" @click="nextForm">다음</button>
        <button v-else class="modu-button" @click="onSubmit" :disabled="isButtonActive">결과보기</button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {
  ref, onMounted, computed, nextTick,
} from 'vue';
import Multiselect from 'vue-multiselect';
import router from '@/router';

// store
import { useMemberStore } from '@/stores/memberStore';

// interface
import type { IMember } from '@/types/Member';

// tempData
import { positionData } from '@/constants/position';
import { visibleTierData } from '@/constants/visibleTier';
import { tierData } from '@/constants/tier';

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
const isStep = ref<number>(1); // 현재 단계
const isType = ref<'random' | 'balance' | 'gift'>('random'); // 이벤트 종류
const isGameType = ref<'ladder' | 'negative'>('ladder'); // 상품 - 게임 타입
const memberList = ref<IMember[]>([]); // 멤버 리스트
const inputValue = ref(''); // 멤버 추가 input
const giftInputValue = ref(''); // 상품 추가 input

/* \
|*|----------------------------------------------------------------------------
|*| 함수(이벤트)
|*|----------------------------------------------------------------------------
\ */

const addMember = () => {
  const validCheck = memberList.value.length ? memberList.value.every((mem: IMember) => mem.name !== inputValue.value) : true;

  if (validCheck) {
    memberList.value.push({
      name: inputValue.value, position: [], visibleTier: null, tier: null, point: 0,
    });
    inputValue.value = '';
  } else {
    alert('이미 추가된 멤버입니다.');
  }
};

const resetMemberList = () => {
  inputValue.value = '';
  memberList.value = [];
  memberStore.setMembers([]);
};

const setCurrentType = (type: 'random' | 'balance' | 'gift') => {
  isType.value = type;
};

const setGameType = (type: 'ladder' | 'negative') => {
  isGameType.value = type;
};

const prevForm = () => {
  if (isStep.value !== 1) {
    isStep.value -= 1;
  }
};

const nextForm = () => {
  if (isStep.value === 2) {
    isStep.value = memberList.value.length > 0 ? 3 : 2;
  } else {
    isStep.value += 1;
  }
};

const isButtonActive = computed(() => {
  let valid = false;

  if (isType.value === 'gift') {
    valid = isStep.value > 3;
  } else if (isType.value === 'balance') {
    // todo!! 9로 변경해야함
    if (memberList.value.length > 1 && memberList.value.length % 5 === 0) {
      valid = true;

      memberList.value.forEach((mem) => {
        if (!mem.position.length || !mem.visibleTier || !mem.tier) {
          valid = false;
        }
      });
    }
  } else {
    valid = memberList.value.length === 10;
  }

  return !valid;
});

// 협곡 팀짜기 멤버 정리
const setBalanceMember = async () => {
  const memberData = memberList.value.map((mem) => {
    const positionValue = mem.position[0]?.value === 'ALL' ? 'M' : mem.position[0]?.value;

    const point = tierData.find(
      (tier) => tier.value === mem.tier?.value
            && tier.position === positionValue,
    )?.point || 0;

    return {
      name: mem.name,
      position: mem.position,
      visibleTier: mem.visibleTier,
      tier: mem.tier,
      point, // 계산된 point 값 설정
    };
  });

  // members에 추가
  const members = JSON.stringify(memberData);
  localStorage.setItem('memberList', members);
  await memberStore.setMembers(memberData);

  await nextTick(() => {
    // 결과 페이지로 이동
    router.push({ name: 'Balance' });
  });
};

const setRandomMember = async () => {
  await memberStore.setMembers(memberList.value);
  await nextTick(() => {
    // 결과 페이지로 이동
    router.push({ name: 'Random' });
  });
};

const onSubmit = () => {
  if (!isButtonActive.value) {
    if (isType.value === 'balance') {
      setBalanceMember();
    } else if (isType.value === 'random') {
      setRandomMember();
    } else if (isType.value === 'gift') {
      // setGiftMember();
    }
  }
};

/* \
|*|----------------------------------------------------------------------------
|*| 최초 세팅
|*|----------------------------------------------------------------------------
\ */
onMounted(() => {
  // localStorage에서 memberList 불러오기
  const storedMembers = localStorage.getItem('memberList');
  if (storedMembers && storedMembers !== '' && storedMembers !== '[]') {
    memberList.value = storedMembers ? JSON.parse(storedMembers) : memberStore.members;
    memberStore.setMembers(memberList.value);
  } else {
    memberStore.setMembers([]);
  }
});

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped lang="scss">
.home-container {
  width: 100%;
  max-width: 700px;

  .logo {
    width: 8rem;
    display: block;
    margin: 0 auto;
    padding: 0 0 2rem;
  }
}

.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .form-group__item {
    padding-bottom: 1rem;
    border-bottom: 1px solid #ccc;

    .form-title {
      color: #15110E;
      font-size: 1.4rem;
      margin-bottom: 0.6rem;
    }
  }
}

.member-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  .member-list__items {
    display: flex;
    gap: 0.4rem;
    align-items: center;

    .member-name {
      width: 100px;
    }
  }

  &.only-name {
    flex-direction: row;
    flex-wrap: wrap;

    .member-list__items {
      width: calc(33.333% - 0.3rem);
    }
  }
}

.member-container {
  width: 100%;
  padding: 1rem;
  margin-top: 0.6rem;
  box-sizing: border-box;
  background: #F2F0F2;

  h5 {
    color: #BF5B04;
    margin-bottom: 0.6rem;
  }
}
</style>
