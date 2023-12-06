import { useState } from "react";

const allEarsClientId = "600f950452a84657b5a28a42c739ceac"
const allEarsClientSecret = "21203cc6dd96448d9e1751b1debe3e38"

const spotifyAPI = "https://api.spotify.com/v1"

async function getAccessToken(clientId = allEarsClientId, clientSecret = allEarsClientSecret) {
    const result = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`
    })

    const data = await result.json();
    return data.access_token;
}

function Search() {

    const [searchQuery, setSearchQuery] = useState('')

    function handleQueryChange(e) {
        setSearchQuery(e.target.value)
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const formattedQuery = encodeURIComponent(searchQuery)
        const searchUrl = `${spotifyAPI}/search?q=${formattedQuery}&type=track,artist,album&limit=10`

        const accessToken = await getAccessToken()

        const response = await fetch(`${searchUrl}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })

        const data = await response.json()
        console.log(data)
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                    id="search-input"
                    type="text"
                    placeholder="Search tracks, artists, and more..."
                    value={searchQuery}
                    onChange={handleQueryChange}
                />
                <button type="submit">Search</button>
                <h2>Search Results:</h2>
            </form>
        </div>
    )
}

export default Search;