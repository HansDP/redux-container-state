
export const requestGif = (topic) => {
	return (dispatch) => {
		dispatch({ type: 'RequestGif'})
		fetchGif(dispatch, topic)
	}
}

const fetchGif = (dispatch, topic) => {

	fetch(`http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${topic}`)
    .then((response) => {
      if (response.status > 400) {
        throw new Error('Error while fetching from the server')
      }
      return response.json()
    })
    .then((body) => body.data.image_url)
    .then((url) => dispatch({ type: 'NewGif', payload: { url }}))
}
