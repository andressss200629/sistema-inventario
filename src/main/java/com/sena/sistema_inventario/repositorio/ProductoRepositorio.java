package com.sena.sistema_inventario.repositorio;

import com.sena.sistema_inventario.entidad.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepositorio extends JpaRepository<Producto, Long> {

    // ✅ Ordena del más nuevo al más viejo (por ID descendente)
    List<Producto> findAllByOrderByIdDesc();
}