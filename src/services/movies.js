
const API_KEY = '507010ff'

export const searchMovies = async ({search}) => {

    if(search === '') return null

    try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${search}`)
        const json = await response.json()

        const movies = json.Search

        // Creamos esta variable para evitar estar atados a la forma de los datos en la api 
        return movies?.map(movie => ({
            id: movie.imdbID,
            title: movie.Title,
            year: movie.Year,
            poster: movie.Poster
        }))
    } catch (error) {
        throw new Error('Error al buscar películas!')
    }
}