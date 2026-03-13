import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [data, setData] = useState([]) // Pour stocker les données de la BDD

  // Cette fonction s'exécute une seule fois au chargement de la page
  useEffect(() => {
    fetch('http://barcelosevilla.com:8080/api.php')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.error("Erreur BDD:", err))
  }, [])

  return (
    <>
      <h1>BarceloSevilla + MySQL</h1>
      
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          Compteur de clics : {count}
        </button>
      </div>

      <div className="database-card" style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px' }}>
        <h2>Données de ma base :</h2>
        {data.length > 0 ? (
          <ul>
            {data.map((item, index) => (
              <li key={index}>
                {/* Ici, affiche une colonne de ta table, par exemple item.nom */}
                {item.nom || JSON.stringify(item)}
              </li>
            ))}
          </ul>
        ) : (
          <p>Chargement des données ou base vide...</p>
        )}
      </div>
    </>
  )
}

export default App