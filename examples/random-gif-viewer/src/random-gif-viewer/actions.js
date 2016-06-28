
export const requestGif = (topic) => {
	return (localDispatch) => {
		localDispatch({ type: 'RequestGif'})
		fetchGif(localDispatch, topic)
	}
}

const fetchGif = (localDispatch, topic) => {

	fetch(`http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=${topic}`)
    .then((response) => {
      if (response.status > 400) {
        throw new Error('Error while fetching from the server')
      }
      return response.json()
    })
    .then((body) => body.data.image_url)
    .then((url) => localDispatch({ type: 'NewGif', payload: { url }}))
}
