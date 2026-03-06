// src/hooks/useRealtimeSync.js
import { useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

export const useRealtimeSync = (setProductos, setProveedores) => {
  useEffect(() => {
    const canalProductos = supabase
      .channel('realtime-productos')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'productos' }, payload => {
        setProductos(prev => [payload.new, ...prev.filter(p => p.id !== payload.new.id)]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'productos' }, payload => {
        setProductos(prev => prev.map(p => p.id === payload.new.id ? { ...p, ...payload.new } : p));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'productos' }, payload => {
        setProductos(prev => prev.filter(p => p.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(canalProductos);
    };
  }, [setProductos]);

  useEffect(() => {
    const canalProveedores = supabase
      .channel('realtime-proveedores')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'proveedores' }, payload => {
        setProveedores(prev => [payload.new, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'proveedores' }, payload => {
        setProveedores(prev => prev.map(p => p.id === payload.new.id ? { ...p, ...payload.new } : p));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'proveedores' }, payload => {
        setProveedores(prev => prev.filter(p => p.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(canalProveedores);
    };
  }, [setProveedores]);
};
