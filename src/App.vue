<template>
  <div class="wrap">
    <div class="container">
      <div class="header">
        <h3>모두롤자<br/> 랜덤 팀&지역 정하기</h3>
        <ul class="join-member-list">
          <li v-for="(mem, key) in members" :key="key">
            🙍‍♂️<br/>
            {{ mem }}
          </li>
        </ul>
        <button @click="onRandom">팀짜기</button>
      </div>


      <div class="teams">
        <div class="team-item">
          <h3>팀1</h3>
          <div v-if="team1.members.length" class="item-content">
            <ul class="selected-member">
              <li v-for="(mem, key) in team1.members" :key="key">
                {{ mem }}
              </li>
            </ul>
            <h5 class="area">{{ team1.area.name }}</h5>
            <p class="champions">{{ team1.area.champions }}</p>
          </div>
        </div>

        <div class="team-item">
          <h3>팀2</h3>
          <div v-if="team2.members.length" class="item-content">
            <ul class="selected-member">
              <li v-for="(mem, key) in team2.members" :key="key">
                {{ mem }}
              </li>
            </ul>
            <h5 class="area">{{ team2.area.name }}</h5>
            <p class="champions">{{ team2.area.champions }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";

const members = ref([
  '소히',
  '규용',
  '선주',
  '건',
  '선모',
  '태완',
  '두산',
  '창하',
  '현섭',
  '',
])

const team1 = ref({
  members: [],
  area: {name: '', champions: ''},
})
const team2 = ref({
  members: [],
  area: {name: '', champions: ''},
})


const areas = ref([
  {name: '빌지워터', champions: '갱플, 그브, 노틸, 닐라, 미포, 일라오이, 트페, 파이크, 피즈, 탐켄치'},
  {name: '필트오버', champions: '바이, 세라핀, 오리아나, 이즈리얼, 제이스, 카밀, 케틀, 하딩, 멜'},
  {name: '프렐요드', champions: '애쉬, 그라가스, 브라움, 애니비아, 트린, 세주아니, 볼베, 올라프, 우디르, 리산드라, 누누, 트런들, 오른, 나르, 오로라'},
  {name: '타곤', champions: '다이애나, 레오나, 소라카, 아우렐솔, 아펠, 조이 타릭, 판테온'},
  {name: '자운', champions: '레나타, 문도, 블츠, 빅토르, 신지드, 에코, 우르곳, 워윅, 자크, 잔나, 제리, 직스, 징크스, 트위치'},
  {name: '이쉬탈', champions: '니달리, 니코, 렝가, 말파, 밀리오, 스카너, 자이라, 키아나'},
  {
    name: '아이오니아',
    champions: '라칸, 리신, 릴리아, 마이, 바루스, 세트, 쉔, 신드라, 아리, 아이번, 아칼리, 야스오, 오공, 요네, 이렐, 자야, 제드, 진, 카르마, 케넨, 케인, 흐웨이'
  },
  {name: '슈리마', champions: '나서스, 나피리, 람머스, 레넥톤, 시비르, 아무무, 아지르, 아크샨, 제라스, 크샨테, 탈리야'},
  {name: '밴들시티', champions: '럼블, 룰루, 베이가, 유미, 코르키, 트타, 티모'},
  {name: '그림자 군도', champions: '그웬, 묘묘카이, 벡스, 비에고, 쓰레쉬, 엘리스, 요릭, 카서스, 칼리스타, 헤카림'},
  {name: '공허', champions: '렉사이, 말자하, 벨베스, 벨코즈, 초가스, 카사딘, 카이사, 카직스, 코그모'},
  {name: '녹서스', champions: '다리우스, 드레이븐, 렐, 르블랑, 리븐, 모데, 브라이어, 블라디, 사미라, 사이온, 스웨인, 암베사, 카시, 카타, 클레드, 탈론'},
])

const onRandom = () => {
  // 멤버 섞기
  const shuffledMembers = [...members.value].filter(mem => mem).sort(() => Math.random() - 0.5);

  // 팀 나누기
  team1.value.members = shuffledMembers.slice(0, 5);
  team2.value.members = shuffledMembers.slice(5, 10);

  // 지역 랜덤 선택
  const shuffledAreas = [...areas.value].sort(() => Math.random() - 0.5);
  team1.value.area = shuffledAreas[0];
  team2.value.area = shuffledAreas[1];

}
</script>

<style lang="scss" scoped>
.wrap {
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;

  .container {
    width: 800px;
    display: flex;
    flex-direction: column;
    gap: 3rem;
    align-items: center;

    .header {
      display: flex;
      align-items: center;
      flex-direction: column;
      text-align: center;
      gap: 1rem;

      h3 {
        font-size: 32px;
      }

      button {
        margin-top: 1rem;
        width: 100px;
        height: 36px;
        color: #ffffff;
        border: none;
        border-radius: 1.2rem;
        background-color: #6b60e5;
        cursor: pointer;

        &:hover {
          background-color: #504b9f;
        }
      }
    }

    .join-member-list {
      display: flex;
      gap: 0.4rem;
      padding: 0;
      list-style: none;

      li {
        list-style: none;
        text-align: center;
      }
    }

    .teams {
      width: 100%;
      display: flex;
      gap: 2rem;

      h3 {
        text-align: center;
        padding-top: 0.8rem;
        padding-bottom: 0.8rem;
      }

      .team-item {
        width: 50%;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        border-radius: 1.2rem;
        border: 1px solid #aaaaaa;
        background-color: #ffffff;

        .item-content {
          padding: 0.8rem 0.8rem 1.2rem;
          border-top: 1px solid #eee;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;

          .area {
            font-size: 24px;
            line-height: 1.5;
          }

          .champions {
            color: #999999;
            font-size: 14px;
            line-height: 1.4;
            text-align: center;
            word-break: keep-all;
          }
        }

        &:first-child {
          h3 {
            color: #df405a;
          }

          li {
            &:nth-child(1) {
              background-color: #40AFDE;
              color: #ffffff;
            }

            &:nth-child(2) {
              background-color: #DED640;
            }

            &:nth-child(3) {
              background-color: #DE405B;
              color: #ffffff;
            }

            &:nth-child(4) {
              background-color: #89555E;
              color: #ffffff;
            }

            &:nth-child(5) {
              background-color: #4B585E;
              color: #ffffff;
            }
          }
        }

        &:last-child {
          h3 {
            color: #6b60e5;
          }

          li {
            &:nth-child(1) {
              background-color: #E6D260;
            }

            &:nth-child(2) {
              background-color: #6C60E6;
              color: #ffffff;
            }

            &:nth-child(3) {
              background-color: #A69E6F;
              color: #ffffff;
            }

            &:nth-child(4) {
              background-color: #706D91;
              color: #ffffff;
            }

            &:nth-child(5) {
              background-color: #66645A;
              color: #ffffff;
            }
          }
        }

        .selected-member {
          display: flex;
          gap: 0.2rem;
          padding: 0;
          list-style: none;
          align-self: center;

          li {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
          }
        }
      }
    }
  }
}
</style>
