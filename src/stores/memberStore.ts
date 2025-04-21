import { defineStore } from 'pinia';
import { useSessionStorage } from '@vueuse/core';
import type { IMember } from '@/types/Member';

export const useMemberStore = defineStore('counter', () => {
  const members = useSessionStorage<IMember[]>('members', []);

  const setMembers = async (member: IMember[]) => {
    members.value = member;
  };

  function clearMembers() {
    members.value = [];
  }

  return { members, setMembers, clearMembers };
});
