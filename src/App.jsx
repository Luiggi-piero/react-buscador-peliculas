import './App.css'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Movies } from './components/Movies'
import { useMovies } from './hooks/useMovies'
import debounce from 'just-debounce-it'

/**
 * 
 * useRef: 
 * - hook para mantener una referencia mutable que persiste durante todo el ciclo de vida del componente
 * - guarda cualquier valor que puedas mutar como un identificador, elemento del dom, un contador, etc
 * - cada vez que cambia no vuelve a renderizar el componente
 * - su valor no se reinicia
 */
function useSearch() {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  // para saber si renderizo por primera vez
  const isFirstInput = useRef(true)

  useEffect(() => {

    if (isFirstInput.current) {
      isFirstInput.current = search === ''
      return
    }

    if (search === '') {
      setError('No se puede buscar una película vacía')
      return
    }

    if (search.match(/^\d+$/)) {
      setError('No se puede buscar una película con un número')
      return
    }

    if (search.length < 3) {
      setError('La búsqueda debe tener al menos 3 caracteres')
      return
    }

    setError(null)
  }, [search])

  return { search, updateSearch, error }
}


function App() {

  const [sort, setSort] = useState(false)
  const { search, updateSearch, error } = useSearch()
  const { movies, getMovies, loading } = useMovies({ search, sort })
  
  const debouncedGetMovies = useCallback(
  debounce(search => {
      console.log('search', search)
      getMovies({search})
    }, 300)
    , [getMovies]
  )


  // Cada vez que se hace click en el boton 'buscar' o presiona 'enter' se ejecuta 'handleSubmit'
  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies({search})

    // Nota: formulario no controlado (FNC)
    // la informacion se obtiene a través del DOM

    // Forma 1 FNC: Para capturar los valores de mas de un input
    /* const fields = Object.fromEntries(new window.FormData(event.target))
    console.log(fields); */

    /* Forma 2 FNC: Otra forma para capturar el valor de un input
    const fields = new window.FormData(event.target)
    const query = fields.get('query')
    console.log(query); */
  }

  const handleSort = () => {
    setSort(!sort)
  }

  // Forma controlada, porque react crea un estado para esto
  const handleChange = (event) => {
    const newSearch = event.target.value
    updateSearch(newSearch)
    debouncedGetMovies( newSearch)
  }

  return (
    <div className='page'>
      <header>
        <h1>Buscador de películas</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input
            onChange={handleChange}
            value={search}
            name='query'
            type="text"
            placeholder='Avengers, Avatar, Ironman...' />

          <input type="checkbox" onChange={handleSort} checked={sort} />
          <button type='submit'>Buscar</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>

      <main>
        {
          loading ? <p>Cargando...</p> : <Movies movies={movies} />
        }
      </main>
    </div>
  )
}

export default App
