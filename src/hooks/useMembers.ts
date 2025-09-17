import { useQuery } from '@tanstack/react-query';
import { Member } from '@/types';

interface MembersResponse {
  success: boolean;
  data: Member[];
  error?: string;
}

const fetchMembers = async (): Promise<Member[]> => {
  const response = await fetch('/api/members');

  if (!response.ok) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }

  const result: MembersResponse = await response.json();

  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error || 'Error desconocido');
  }
};

export const useMembers = () => {
  return useQuery({
    queryKey: ['members'],
    queryFn: fetchMembers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};