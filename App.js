import { useEffect, useState } from 'react';

const posiciones = ['Portero', 'Defensa', 'Medio', 'Delantero'];

function generarEquipos(jugadores) {
  const A = [], B = [];
  let nivelA = 0, nivelB = 0;

  const porPos = (p) => jugadores.filter(j => j.posicion === p).sort((a,b)=>b.nivel-a.nivel);

  const porteros = porPos('Portero');
  if (porteros[0]) { A.push(porteros[0]); nivelA += porteros[0].nivel; }
  if (porteros[1]) { B.push(porteros[1]); nivelB += porteros[1].nivel; }

  ['Defensa','Medio','Delantero'].forEach(p => {
    porPos(p).forEach(j => {
      if (nivelA <= nivelB) { A.push(j); nivelA += j.nivel; }
      else { B.push(j); nivelB += j.nivel; }
    });
  });

  return { A, B, nivelA, nivelB };
}

export default function App() {
  const [jugadores, setJugadores] = useState([]);
  const [nombre, setNombre] = useState('');
  const [posicion, setPosicion] = useState('Defensa');
  const [nivel, setNivel] = useState(5);
  const [seleccion, setSeleccion] = useState([]);
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem('jugadores') || '[]');
    setJugadores(guardados);
  }, []);

  useEffect(() => {
    localStorage.setItem('jugadores', JSON.stringify(jugadores));
  }, [jugadores]);

  const agregar = () => {
    if (!nombre) return;
    setJugadores([...jugadores, { nombre, posicion, nivel }]);
    setNombre('');
    setNivel(5);
  };

  const generar = () => {
    const j = seleccion.map(i => jugadores[i]);
    setResultado(generarEquipos(j));
  };

  return (
    <div style={{padding:20,maxWidth:700,margin:'auto'}}>
      <h1>⚽ Generador de Equipos</h1>

      <div>
        <input placeholder="Nombre" value={nombre} onChange={e=>setNombre(e.target.value)} />
        <select value={posicion} onChange={e=>setPosicion(e.target.value)}>
          {posiciones.map(p=><option key={p}>{p}</option>)}
        </select>
        <input type="number" min="1" max="10" value={nivel} onChange={e=>setNivel(+e.target.value)} />
        <button className="bg-green" onClick={agregar}>Añadir</button>
      </div>

      <ul>
        {jugadores.map((j,i)=>(
          <li key={i}>
            <input type="checkbox" onChange={()=>setSeleccion(
              seleccion.includes(i)? seleccion.filter(x=>x!==i): [...seleccion,i]
            )} />
            {j.nombre} - {j.posicion} ({j.nivel})
          </li>
        ))}
      </ul>

      <button className="bg-blue" onClick={generar}>Generar equipos</button>

      {resultado && (
        <div style={{display:'flex',gap:40}}>
          <div>
            <h3>Equipo A ({resultado.nivelA})</h3>
            {resultado.A.map((j,i)=><div key={i}>{j.nombre}</div>)}
          </div>
          <div>
            <h3>Equipo B ({resultado.nivelB})</h3>
            {resultado.B.map((j,i)=><div key={i}>{j.nombre}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}
