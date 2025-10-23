"use client";

import { useTenant } from './useTenant';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Member, MemberFormData } from '@/app/members/types/member';
import { MemberRole } from '@prisma/client';
import {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember as updateMemberAction,
  deleteMember as deleteMemberAction,
  deactivateMember,
  isEmailTaken,
  getMemberStats,
} from '@/app/members/actions/members.actions';

// ============ TYPES ============

export interface GetAllMembersOptions {
  limit?: number;
  offset?: number;
  search?: string;
  role?: MemberRole;
  orderBy?: "firstName" | "lastName" | "createdAt";
  orderDirection?: "asc" | "desc";
}

export interface GetAllMembersResult {
  members: Member[];
  total: number;
  hasMore: boolean;
}

// ============ TENANT-AWARE HOOKS ============

/**
 * Hook para obtener todos los miembros con filtrado automático por tenant
 */
export function useTenantMembers(options?: GetAllMembersOptions) {
  const { hasChurch, churchId } = useTenant();

  return useQuery({
    queryKey: ['members', 'all', churchId, options],
    queryFn: () => getAllMembers(options),
    enabled: hasChurch, // Solo ejecutar si hay un church_id
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

/**
 * Hook para obtener un miembro específico por ID
 */
export function useTenantMember(id: string) {
  const { hasChurch, churchId } = useTenant();

  return useQuery({
    queryKey: ['members', 'detail', churchId, id],
    queryFn: () => getMemberById(id),
    enabled: hasChurch && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook para obtener estadísticas de miembros
 */
export function useTenantMemberStats() {
  const { hasChurch, churchId } = useTenant();

  return useQuery({
    queryKey: ['members', 'stats', churchId],
    queryFn: getMemberStats,
    enabled: hasChurch,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * Hook para verificar si un email está en uso
 */
export function useTenantEmailCheck(email: string, excludeId?: string) {
  const { hasChurch, churchId } = useTenant();

  return useQuery({
    queryKey: ['members', 'email-check', churchId, email, excludeId],
    queryFn: () => isEmailTaken(email, excludeId),
    enabled: hasChurch && !!email && email.length > 0,
    staleTime: 30 * 1000, // 30 segundos
  });
}

// ============ MUTATION HOOKS ============

/**
 * Hook para crear un nuevo miembro
 */
export function useCreateTenantMember() {
  const queryClient = useQueryClient();
  const { churchId } = useTenant();

  return useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      // Invalidar todas las queries relacionadas con miembros para este tenant
      queryClient.invalidateQueries({ 
        queryKey: ['members', 'all', churchId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['members', 'stats', churchId] 
      });
    },
    onError: (error) => {
      console.error('Error creating member:', error);
    },
  });
}

/**
 * Hook para actualizar un miembro existente
 */
export function useUpdateTenantMember() {
  const queryClient = useQueryClient();
  const { churchId } = useTenant();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MemberFormData> }) =>
      updateMemberAction(id, data),
    onSuccess: (updatedMember) => {
      // Invalidar queries específicas
      queryClient.invalidateQueries({ 
        queryKey: ['members', 'all', churchId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['members', 'detail', churchId, updatedMember.id] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['members', 'stats', churchId] 
      });
    },
    onError: (error) => {
      console.error('Error updating member:', error);
    },
  });
}

/**
 * Hook para eliminar un miembro
 */
export function useDeleteTenantMember() {
  const queryClient = useQueryClient();
  const { churchId } = useTenant();

  return useMutation({
    mutationFn: deleteMemberAction,
    onSuccess: (_, deletedId) => {
      // Invalidar queries y remover el miembro específico del cache
      queryClient.invalidateQueries({ 
        queryKey: ['members', 'all', churchId] 
      });
      queryClient.removeQueries({ 
        queryKey: ['members', 'detail', churchId, deletedId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['members', 'stats', churchId] 
      });
    },
    onError: (error) => {
      console.error('Error deleting member:', error);
    },
  });
}

/**
 * Hook para desactivar un miembro (soft delete)
 */
export function useDeactivateTenantMember() {
  const queryClient = useQueryClient();
  const { churchId } = useTenant();

  return useMutation({
    mutationFn: deactivateMember,
    onSuccess: (updatedMember) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ 
        queryKey: ['members', 'all', churchId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['members', 'detail', churchId, updatedMember.id] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['members', 'stats', churchId] 
      });
    },
    onError: (error) => {
      console.error('Error deactivating member:', error);
    },
  });
}

// ============ UTILITY HOOKS ============

/**
 * Hook para invalidar todas las queries de miembros del tenant actual
 */
export function useInvalidateTenantMemberQueries() {
  const queryClient = useQueryClient();
  const { churchId } = useTenant();

  return () => {
    queryClient.invalidateQueries({ 
      queryKey: ['members', 'all', churchId] 
    });
    queryClient.invalidateQueries({ 
      queryKey: ['members', 'stats', churchId] 
    });
    // Invalidar todas las queries de detalles de miembros
    queryClient.invalidateQueries({ 
      queryKey: ['members', 'detail', churchId] 
    });
  };
}

/**
 * Hook para prefetch de miembros (útil para navegación)
 */
export function usePrefetchTenantMember() {
  const queryClient = useQueryClient();
  const { hasChurch, churchId } = useTenant();

  return (id: string) => {
    if (!hasChurch || !id) return;

    queryClient.prefetchQuery({
      queryKey: ['members', 'detail', churchId, id],
      queryFn: () => getMemberById(id),
      staleTime: 5 * 60 * 1000,
    });
  };
}