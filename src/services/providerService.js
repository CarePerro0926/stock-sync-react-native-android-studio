// src/services/providerService.js
import { supabase } from './supabaseClient';

export const providerService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('proveedores')
      .select('id,nombre,email,telefono')
      .order('nombre', { ascending: true });

    if (error) throw error;

    const proveedores = data || [];

    const proveedoresConCategorias = await Promise.all(
      proveedores.map(async (prov) => {
        const { data: cats, error: catsErr } = await supabase
          .from('proveedor_categorias')
          .select('categoria_id')
          .eq('proveedor_id', prov.id);

        if (catsErr) throw catsErr;

        return {
          ...prov,
          categorias: (cats || []).map(c => c.categoria_id)
        };
      })
    );

    return proveedoresConCategorias;
  },

  create: async (proveedor) => {
    const { nombre, email, telefono, categorias = [], productos = [] } = proveedor;

    const { data, error } = await supabase
      .from('proveedores')
      .insert([{ nombre, email, telefono }])
      .select('id')
      .single();
    
    if (error) throw error;
    const provId = data.id;

    if (Array.isArray(categorias) && categorias.length > 0) {
      const relCats = categorias.map(catId => ({
        proveedor_id: provId,
        categoria_id: catId
      }));
      const { error: catErr } = await supabase
        .from('proveedor_categorias')
        .insert(relCats);
      if (catErr) throw catErr;
    }

    if (Array.isArray(productos) && productos.length > 0) {
      const relProds = productos.map(prodId => ({
        proveedor_id: provId,
        producto_id: prodId
      }));
      const { error: prodErr } = await supabase
        .from('producto_proveedor')
        .insert(relProds);
      if (prodErr) throw prodErr;
    }

    return true;
  },

  update: async (proveedor) => {
    const { id, nombre, email, telefono } = proveedor;
    const { error } = await supabase
      .from('proveedores')
      .update({ nombre, email, telefono })
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  remove: async (id) => {
    const { error } = await supabase
      .from('proveedores')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
};
