import { Member } from '@/types';

export interface MockDataType {
  members: Member[];
}

export interface MockDataConfig {
  enableMockData: boolean;
  dataSource: 'local' | 'api';
}