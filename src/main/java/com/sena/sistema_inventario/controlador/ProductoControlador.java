package com.sena.sistema_inventario.controlador;

import com.sena.sistema_inventario.entidad.Producto;
import com.sena.sistema_inventario.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*") // Permite que tu página web se conecte
public class ProductoControlador {

    @Autowired
   private ProductoService servicio;

    // 📋 LISTAR TODOS los productos
    @GetMapping
    public List<Producto> listarTodos() {
        return servicio.listarTodos();
    }

    // 🔍 BUSCAR producto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Producto> buscarPorId(@PathVariable Long id) {
        return servicio.buscarPorId(id)
                .map(producto -> ResponseEntity.ok(producto))
                .orElse(ResponseEntity.notFound().build());
    }

    // ➕ GUARDAR producto nuevo
    @PostMapping
    public ResponseEntity<Map<String, Object>> guardar(@RequestBody Producto producto) {
        Map<String, Object> resp = new HashMap<>();
        try {
            Producto guardado = servicio.guardar(producto);
            resp.put("ok", true);
            resp.put("mensaje", "✅ Producto guardado correctamente");
            resp.put("producto", guardado);
            return ResponseEntity.status(201).body(resp);
        } catch (Exception e) {
            resp.put("ok", false);
            resp.put("mensaje", "❌ Error: Código duplicado o datos incorrectos");
            return ResponseEntity.status(400).body(resp);
        }
    }

    // ✏️ ACTUALIZAR producto
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> actualizar(@PathVariable Long id, @RequestBody Producto datosNuevos) {
        Map<String, Object> resp = new HashMap<>();
        try {
            Producto actualizado = servicio.actualizar(id, datosNuevos);
            resp.put("ok", true);
            resp.put("mensaje", "✅ Producto actualizado");
            resp.put("producto", actualizado);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            resp.put("ok", false);
            resp.put("mensaje", "❌ Error al actualizar: " + e.getMessage());
            return ResponseEntity.status(400).body(resp);
        }
    }

    // 🗑️ ELIMINAR producto
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> eliminar(@PathVariable Long id) {
        Map<String, Object> resp = new HashMap<>();
        try {
            servicio.eliminar(id);
            resp.put("ok", true);
            resp.put("mensaje", "✅ Producto eliminado");
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            resp.put("ok", false);
            resp.put("mensaje", "❌ Error al eliminar");
            return ResponseEntity.status(400).body(resp);
        }
    }
}
