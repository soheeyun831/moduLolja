import { defineStore } from 'pinia';
import { useSessionStorage } from '@vueuse/core';

export const useMemberStore = defineStore('counter', () => {
  const members = useSessionStorage<string[]>('members', []);

  const setMembers = async (member: string[]) => {
    members.value = member;
  };

  function clearMembers() {
    members.value = [];
  }

  return { members, setMembers, clearMembers };
});
