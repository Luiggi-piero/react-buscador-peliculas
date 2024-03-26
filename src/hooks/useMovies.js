import { useRef, useState, useMemo, useCallback } from 'react'
import { searchMovies } from '../services/movies'

/**
 * 
 * Nota: el cuerpo del componente o custom hook se vuelve a ejecutar
 * cada vez que se renderiza
 * 
 * useCallback: es lo mismo que useMemo pero pensado para funciones
 */

export function useMovies({ search, sort }) {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState([])
    const previousSearch = useRef(search)

    // cada vez que cambie search se vuelve a generar esta funcion
    const getMovies = useCallback( async ({search}) => {
            if (previousSearch.current === search) return

            try {
                setLoading(true)
                setError(null)
                previousSearch.current = search
                const newMovies = await searchMovies({ search })
                setMovies(newMovies)
            } catch (error) {
                setError(error.message)
            } finally {
                // esto se ejecutar tanto despues del try o catch
                setLoading(false)
            }
        }, [])

    // useMemo: memorizar valor
    // - evitamos tener que volver a ordenar las peliculas si no a cambiado
    // - evitar realizar el calculo de ordenar , solo se hace si cambia cierta informacion (movies o sort)
    // - cuando se escribe en el input cambia search, pero como no es una dependencia de sortedMovies
    //  no se calcula
    const sortedMovies = useMemo(() => {
        return sort 
        ? [...movies]?.sort((a, b) => a.title.localeCompare(b.title))
        : movies
    }, [sort, movies])


    return { movies: sortedMovies, getMovies, loading, error }
}