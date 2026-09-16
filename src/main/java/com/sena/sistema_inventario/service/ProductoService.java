package com.sena.sistema_inventario.service;

import com.sena.sistema_inventario.entidad.Producto;
import com.sena.sistema_inventario.repositorio.ProductoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {  // ✅ NOMBRE CORREGIDO (sin S final)

    @Autowired
    private ProductoRepositorio repositorio;

    // 📋 LISTAR TODOS ordenados del más nuevo al más viejo
    public List<Producto> listarTodos() {
        return repositorio.findAllByOrderByIdDesc();
    }

    // 🔍 BUSCAR POR ID
    public Optional<Producto> buscarPorId(Long id) {
        return repositorio.findById(id);
    }

    // ➕ GUARDAR NUEVO
    public Producto guardar(Producto producto) {
        return repositorio.save(producto);
    }

    // ✏️ ACTUALIZAR
    public Producto actualizar(Long id, Producto datosNuevos) {
        return repositorio.findById(id).map(producto -> {
            producto.setCodigo(datosNuevos.getCodigo());
            producto.setNombre(datosNuevos.getNombre());
            producto.setCategoria(datosNuevos.getCategoria());
            producto.setProveedor(datosNuevos.getProveedor());
            producto.setPrecio(datosNuevos.getPrecio());
            producto.setCantidad(datosNuevos.getCantidad());
            return repositorio.save(producto);
        }).orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    // 🗑️ ELIMINAR
    public void eliminar(Long id) {
        repositorio.deleteById(id);
    }
}