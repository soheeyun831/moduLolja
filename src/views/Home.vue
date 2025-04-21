<template>
  <div>
    <ul class="form-group">
      <li class="form-group__item">
        <h3 class="form-title">종류 세팅</h3>
        <div class="check-button-group">
          <button class="modu-button check-type"
                  @click="setCurrentType('random')"
                  :class="{'is-active': isType ==='random'}">
            칼바람 랜덤
          </button>
          <button class="modu-button check-type"
                  @click="setCurrentType('balance')"
                  :class="{'is-active': isType ==='balance'}">협곡
            팀짜기
          </button>
          <button class="modu-button check-type"
                  @click="setCurrentType('gift')"
                  :class="{'is-active': isType ==='gift'}">
            무작위 상품 뿌리기
          </button>
        </div>
      </li>
      <li v-if="isStep > 1" class="form-group__item">
        <h3 class="form-title">멤버 세팅</h3>
        <div v-if="isStep === 2" class="add-input-group">
          <input v-model="inputValue" class="modu-input" @keydown.enter="addMember"/>
          <button class="modu-button small" @click="addMember" :disabled="!inputValue || inputValue === ''">추가</button>
        </div>
        <div v-if="memberList.length" class="member-container">
          <h5>현재 멤버</h5>
          <ul class="member-list">
            <li v-for="(mem, key) in memberList" :key="key" class="member-list__items">
              <span>🧑 {{ mem.name }}</span>
              <template v-if="isType === 'balance'">
                <select v-model="mem.position1" class="modu-input" :class="{'is-placeholder': mem.position1 === ''}">
                  <option disabled hidden value="" selected>
                    1지망 포지션
                  </option>
                  <option value="top">탑</option>
                  <option value="jungle">정글</option>
                  <option value="mid">미드</option>
                  <option value="adc">원딜</option>
                  <option value="support">서폿</option>
                  <option value="all">상관없음</option>
                </select>
                <select v-model="mem.position2" class="modu-input" :class="{'is-placeholder': mem.position2 === ''}">
                  <option disabled hidden value="" selected>
                    2지망 포지션
                  </option>
                  <option value="top">탑</option>
                  <option value="jungle">정글</option>
                  <option value="mid">미드</option>
                  <option value="adc">원딜</option>
                  <option value="support">서폿</option>
                  <option value="all">상관없음</option>
                </select>
                <select v-model="mem.tier" class="modu-input" :class="{'is-placeholder': mem.tier === ''}">
                  <option disabled hidden value="" selected>
                    실제 티어
                  </option>
                </select>
                <select v-model="mem.visibleTier" class="modu-input"
                        :class="{'is-placeholder': mem.visibleTier === ''}">
                  <option disabled hidden value="" selected>
                    현재 티어
                  </option>
                </select>
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
import { ref, onMounted, computed } from 'vue';
import { useMemberStore } from '@/stores/memberStore';
import type { IMember } from '@/types/Member';

const { members, setMembers } = useMemberStore();

const isStep = ref<number>(1);
const isType = ref<'random' | 'balance' | 'gift'>('random');
const isGameType = ref<'ladder' | 'negative'>('ladder');
const memberList = ref<IMember[]>([]);
const inputValue = ref('');

const addMember = () => {
  memberList.value.push({
    name: inputValue.value, position1: '', position2: '', visibleTier: '', tier: '', point: 0,
  });
  inputValue.value = '';
};

const setCurrentType = (type: 'random' | 'balance' | 'gift') => {
  isType.value = type;
};

const setGameType = (type: 'ladder' | 'negative') => {
  isGameType.value = type;
};

const prevForm = () => {
  if (isStep.value === 2) {
    isStep.value = memberList.value.length > 0 ? 1 : 2;
  } else {
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
  if (isType.value === 'gift') {
    return isStep.value < 2;
  }
  return memberList.value.length < 10 || memberList.value.length % 5 !== 0;
});

const onSubmit = () => {
  // todo!! 결과 정리
};

onMounted(() => {
  // 초기화
  setMembers([]);
});

</script>

<style scoped lang="scss">

.text-button {
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
}

.modu-button {
  height: 40px;
  padding: 10px;
  cursor: pointer;
  color: #F2F0F2;
  border: 1px solid #3F8457;
  background: #3F8457;
  transition: all 0.3s;

  &:hover,
  &:focus {
    color: #F2F0F2;
    background-color: #1C5931;
    border: 1px solid #1C5931;
    transition: all 0.3s;
  }

  &:disabled,
  &:disabled:hover,
  &:disabled:focus {
    color: #70AE86;
    background-color: #B0D9BE;
    border: 1px solid #B0D9BE;
    transition: all 0.3s;
  }

  &.check-type {
    color: #1C5931;
    border: 1px solid #1C5931;
    background-color: #F2F0F2;

    &.is-active {
      color: #F2F0F2;
      background-color: #1C5931;

      &:hover,
      &:focus {
        color: #F2F0F2;
        border: 1px solid #114222;
        background-color: #114222;
      }
    }

    &:hover,
    &:focus {
      color: #114222;
      background-color: #dad9da;
      border: 1px solid #114222;
    }

    &:disabled,
    &:disabled:hover,
    &:disabled:focus {
      color: #39754c;
      background-color: #dad9da;
      border: 1px solid #39754c;
    }
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

    &.button-group {
      display: flex;
      justify-content: center;
      border-bottom: none;
      gap: 0.4rem;
    }

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
  }
}

.modu-input {
  height: 40px;
  box-sizing: border-box;
  color: #1C5931;
  border: 1px solid #3F8457;
  background-color: #F2F0F2;
  transition: all 0.5s;

  &.is-placeholder {
    color: #70AE86;
    border: 1px solid #70AE86;
  }

  &:focus,
  &:active {
    outline: none;
    border: 1px solid #1C5931;
    background-color: #ffffff;
    transition: all 0.5s;
  }
  &select {
    width: 120px;
  }
}

.check-button-group {
  display: flex;
  gap: 0.4rem;
}

.add-input-group {
  display: flex;
  gap: 0.4rem;
}

.member-container {
  width: 100%;
  max-height: 570px;
  padding: 1rem;
  margin-top: 0.6rem;
  overflow: auto;
  box-sizing: border-box;
  background: #F2F0F2;

  h5 {
    color: #BF5B04;
    margin-bottom: 0.6rem;
  }
}

.description {
  margin-top: 0.6rem;
  color: #D97904;
  font-size: 13px;
  line-height: 1.6;
}
</style>
