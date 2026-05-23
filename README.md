#  Calculadora de Raíces — Métodos Numéricos

Aplicación web interactiva desarrollada con React para resolver ecuaciones no lineales mediante distintos métodos numéricos clásicos.

La plataforma permite visualizar gráficamente el comportamiento de funciones matemáticas, analizar la convergencia de algoritmos iterativos y estudiar el proceso de aproximación de raíces reales.

---

#  Características

✅ Método de Bisección  
✅ Método de Newton-Raphson  
✅ Método de la Secante  
✅ Método de Falsa Posición  
✅ Gráfica interactiva de funciones  
✅ Visualización de convergencia  
✅ Tabla detallada de iteraciones  
✅ Soporte para funciones trigonométricas  
✅ Soporte para logaritmos y exponenciales  
✅ Detección de divergencia  
✅ Validación de funciones sin raíces reales  
✅ Tema oscuro y claro  
✅ Interfaz responsive  

---

#  Vista General

La aplicación permite:

- Ingresar funciones matemáticas.
- Definir intervalos o puntos iniciales.
- Configurar tolerancia numérica.
- Ejecutar distintos métodos iterativos.
- Visualizar el proceso de convergencia.
- Observar la raíz aproximada sobre la gráfica.

---

#  Métodos Implementados

## Método de Bisección

Método cerrado que divide repetidamente un intervalo donde existe cambio de signo.



---

## Método de Newton-Raphson

Método abierto basado en derivadas para aproximación rápida de raíces.



---

## Método de la Secante

Aproxima la derivada usando dos puntos consecutivos.



---

## Método de Falsa Posición

Método híbrido entre bisección y secante.



---

#  Arquitectura del Proyecto

```text
src/
│
├── components/
│   ├── Graph.jsx
│   ├── InputPanel.jsx
│   ├── IterationsTable.jsx
│   └── ConvergenceGraph.jsx
│
├── App.jsx
├── main.jsx
│
public/
│
├── LOGO-APP.png
│
package.json
```

---

#  Tecnologías Utilizadas

| Tecnología | Uso |
|---|---|
| React | Construcción de interfaz |
| Vite | Bundler y entorno de desarrollo |
| TailwindCSS | Estilos y diseño responsive |
| Chart.js | Visualización gráfica |
| react-chartjs-2 | Integración React + Chart.js |
| Math.js | Evaluación y derivación simbólica |
| JavaScript | Lógica de la aplicación |
| Vercel | Despliegue y hosting |

---

#  Funcionalidades Matemáticas

La aplicación soporta:

- Funciones polinómicas
- Funciones trigonométricas
- Funciones exponenciales
- Funciones logarítmicas
- Multiplicación implícita
- Notación matemática en español

Ejemplos válidos:

```txt
x^3 - x - 2
cos(x) - x
e^x - 4
ln(x)
sen(x)
5x^2 + 3x - 1
```

---

#  Tema Oscuro y Claro

La aplicación incluye soporte para:

- 🌙 Dark Mode
- ☀️ Light Mode

La preferencia del usuario se guarda automáticamente mediante `localStorage`.

---

#  Convergencia

Cada método muestra:

- Tabla de iteraciones
- Error absoluto
- Aproximaciones sucesivas
- Gráfica de convergencia

Esto permite analizar visualmente la rapidez y estabilidad de cada algoritmo numérico.

---

#  Validaciones Implementadas

La aplicación detecta automáticamente:

✅ División por cero  
✅ Divergencia numérica  
✅ Derivadas nulas  
✅ Funciones inválidas  
✅ Intervalos incorrectos  
✅ Funciones sin raíces reales  
✅ Valores no numéricos  

---

#  Instalación Local

## 1. Clonar repositorio

```bash
git clone https://github.com/TU-USUARIO/TU-REPOSITORIO.git
```

---

## 2. Entrar al proyecto

```bash
cd TU-REPOSITORIO
```

---

## 3. Instalar dependencias

```bash
npm install
```

---

## 4. Ejecutar servidor

```bash
npm run dev
```

---

# 🌐 Deploy

La aplicación puede desplegarse fácilmente usando:

- Vercel
- Netlify
- GitHub Pages

---

#  Objetivo Académico

Este proyecto fue desarrollado con fines educativos para el estudio de:

- Métodos Numéricos
- Análisis Numérico
- Aproximación de raíces
- Convergencia de algoritmos iterativos
- Visualización matemática

---

#  Autor

Desarrollado por **Sebastian Alcendra-Santiago Torres- Samuel Peñaranda- Jairo Blanco- Alexander Fajardo**

---

#  Licencia

Este proyecto es de uso educativo y académico.
