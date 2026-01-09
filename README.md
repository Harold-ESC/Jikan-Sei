# Jikan-Sei (時間静) - Horario Circular Interactivo

Es una aplicación web moderna diseñada para transformar la gestión del tiempo en una experiencia visual y fluida. A diferencia de los calendarios tradicionales, utiliza una interfaz circular de 24 horas que permite entender la distribución del día de un solo vistazo, ideal para estudiantes y profesionales que buscan un equilibrio entre productividad y bienestar En su version Sei .

## Características

- **Visualización Circular (Donut Chart)** - Representación intuitiva del ciclo de 24 horas mediante sectores SVG dinámicos.
- **Gestión Semanal Inteligente** - Horarios diferenciados para días laborales y fines de semana (completamente personalizables).
- **Dashboard de Actividad Actual** - Tarjeta dinámica que muestra la tarea en curso, descripción y una cuenta regresiva en tiempo real.
- **Modo Adaptativo (Auto Day/Night)** - Cambio automático de tema basado en la hora local (Light/Dark) para reducir la fatiga visual.
- **Enfoque en Accesibilidad (PWA Ready)** - Diseño mobile-first optimizado para su uso como aplicación nativa en dispositivos móviles.
- **Navegación Instantánea:** - Selector de días rápido para planificar el resto de la semana sin recargas de página.

## Demo Visual

Vista de Día (Light)

<img width="899" height="879" alt="image" src="https://github.com/user-attachments/assets/f9c4c353-ed46-4ea3-985e-335014f8924f" />

Vista de Noche (Dark)

<img width="897" height="841" alt="image" src="https://github.com/user-attachments/assets/ce28dad6-aabf-4fe4-b648-108359a97371" />


## Instalación y Uso

###Prerrequisitos
- Node.js 18+ y npm

###Pasos
```bash
# 1. Clonar el repositorio
git clone https://github.com/Harold-ESC/Jikan-Maru.git

# 2. Entrar al directorio
cd Jikan-Maru

# 3. Instalar dependencias
npm install

# 4. Iniciar servidor de desarrollo
npm run dev
```

La aplicación se ejecutará en `http://localhost:3000`

## Personalización de Horarios

Actualmente, puedes configurar tus rutinas editando el objeto WEEKLY_SCHEDULE en src/utils.js. Cada actividad sigue esta estructura:

{
  id: 'work_block',           // Identificador único
  label: 'Trabajo Profundo',  // Nombre visible
  start: '09:00',             // Formato 24h
  end: '13:00',               // Formato 24h
  color: '#38bdf8',           // Color del sector (HEX)
  description: 'Enfoque en tareas de alta prioridad',
  type: 'work'                // Categoría (work, rest, health, etc.)
}



## Tecnologías

Core: React 18 (Hooks, Memoización de datos).
Herramientas de Construcción: Vite 5 para un HMR (Hot Module Replacement) ultrarrápido.
Estilos: Tailwind CSS para un diseño responsivo y utilitario.
Iconografía: Lucide React para una interfaz limpia y minimalista.


## Roadmap (Próximas Mejoras)

- [ ] Editor Visual: Interfaz para arrastrar y soltar sectores para cambiar horarios
- [ ] Dual Style: Implementación de los estilos Maru (circular) y Sei (lineal/bloques) en la misma app
- [ ] Persistencia: Guardado automático de cambios mediante localStorage o Firebase
- [ ] PWA: Configuración de Service Workers para uso offline y acceso directo en el móvil.
- [ ] Estadísticas: Gráficas semanales sobre el uso del tiempo (ej. % de descanso vs % de estudio)
- [ ] Exportar/importar configuraciones

## Contribuciones

¡Las ideas y mejoras son bienvenidas! Para contribuir:
Haz un Fork del proyecto.
Crea una rama para tu mejora: git checkout -b feature/NuevaMejora.
Haz un Commit de tus cambios: git commit -m 'Añadida nueva funcionalidad'.
Sube tu rama: git push origin feature/NuevaMejora.
Abre un Pull Request.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

## Autor

**Harold-ESC**
- Estudiante de Ciencias de la Computación en la Universidad Nacional de Colombia (Unal)
- GitHub: [@Harold-ESC](https://github.com/Harold-ESC)
