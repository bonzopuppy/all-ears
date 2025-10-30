import requests
import base64

# =============================================================================
# STEP 1: ADD YOUR SPOTIFY CREDENTIALS HERE
# =============================================================================
CLIENT_ID = "your_client_id_here"
CLIENT_SECRET = "your_client_secret_here"

# =============================================================================
# STEP 2: GET ACCESS TOKEN (same as before)
# =============================================================================
def get_access_token(client_id, client_secret):
    """Get an access token from Spotify."""
    auth_url = "https://accounts.spotify.com/api/token"
    
    auth_string = f"{client_id}:{client_secret}"
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = base64.b64encode(auth_bytes).decode("utf-8")
    
    headers = {
        "Authorization": f"Basic {auth_base64}",
        "Content-Type": "application/x-www-form-urlencoded"
    }
    
    data = {"grant_type": "client_credentials"}
    
    response = requests.post(auth_url, headers=headers, data=data)
    
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        print(f"Error getting token: {response.status_code}")
        print(response.text)
        return None

# =============================================================================
# STEP 3: GET RECOMMENDATIONS
# =============================================================================
def get_recommendations(access_token, 
                       seed_artists=None, 
                       seed_tracks=None, 
                       seed_genres=None,
                       limit=20):
    """
    Get track recommendations from Spotify.
    
    YOU MUST PROVIDE AT LEAST ONE OF: seed_artists, seed_tracks, or seed_genres
    Maximum 5 seeds total (combined across all three types)
    
    Parameters:
    - access_token: Your Spotify access token
    - seed_artists: List of artist IDs (e.g., ["4Z8W4fKeB5YxbusRsdQVPb"])
    - seed_tracks: List of track IDs (e.g., ["0c6xIDDpzE81m2q797ordA"])
    - seed_genres: List of genres (e.g., ["rock", "blues"])
    - limit: How many recommendations to return (default 20, max 100)
    
    Example:
        # Get recommendations based on Radiohead
        get_recommendations(token, seed_artists=["4Z8W4fKeB5YxbusRsdQVPb"])
        
        # Get recommendations based on rock and blues genres
        get_recommendations(token, seed_genres=["rock", "blues"])
    """
    url = "https://api.spotify.com/v1/recommendations"
    
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    # Build the parameters
    params = {
        "limit": limit
    }
    
    # Add seeds (must have at least one!)
    if seed_artists:
        params["seed_artists"] = ",".join(seed_artists)
    
    if seed_tracks:
        params["seed_tracks"] = ",".join(seed_tracks)
    
    if seed_genres:
        params["seed_genres"] = ",".join(seed_genres)
    
    # Make the request
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        return None

# =============================================================================
# STEP 4: SEARCH FOR ARTISTS/TRACKS TO USE AS SEEDS
# =============================================================================
def search_artist(access_token, artist_name):
    """
    Search for an artist by name to get their ID.
    Returns the artist ID or None.
    """
    url = "https://api.spotify.com/v1/search"
    
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    params = {
        "q": artist_name,
        "type": "artist",
        "limit": 1
    }
    
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        data = response.json()
        if data["artists"]["items"]:
            artist = data["artists"]["items"][0]
            return artist["id"], artist["name"]
    
    return None, None

def search_track(access_token, track_name, artist_name=None):
    """
    Search for a track by name to get its ID.
    Returns the track ID or None.
    """
    url = "https://api.spotify.com/v1/search"
    
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    query = track_name
    if artist_name:
        query += f" artist:{artist_name}"
    
    params = {
        "q": query,
        "type": "track",
        "limit": 1
    }
    
    response = requests.get(url, headers=headers, params=params)
    
    if response.status_code == 200:
        data = response.json()
        if data["tracks"]["items"]:
            track = data["tracks"]["items"][0]
            return track["id"], track["name"], track["artists"][0]["name"]
    
    return None, None, None

# =============================================================================
# STEP 5: RUN EXAMPLES
# =============================================================================
if __name__ == "__main__":
    print("=" * 70)
    print("SPOTIFY RECOMMENDATIONS API")
    print("=" * 70)
    print()
    
    # Get access token
    print("Getting access token...")
    access_token = get_access_token(CLIENT_ID, CLIENT_SECRET)
    
    if not access_token:
        print("Failed to get access token. Check your credentials!")
        exit()
    
    print("✓ Access token received!")
    print()
    
    # =============================================================================
    # EXAMPLE 1: Recommendations based on an ARTIST
    # =============================================================================
    print("=" * 70)
    print("EXAMPLE 1: Get recommendations based on an artist")
    print("=" * 70)
    
    # Search for Talking Heads
    artist_id, artist_name = search_artist(access_token, "Talking Heads")
    
    if artist_id:
        print(f"Found artist: {artist_name} (ID: {artist_id})")
        print()
        print("Getting recommendations based on Talking Heads...")
        
        recommendations = get_recommendations(
            access_token,
            seed_artists=[artist_id],
            limit=10
        )
        
        if recommendations and "tracks" in recommendations:
            print(f"\n✓ Found {len(recommendations['tracks'])} recommendations:\n")
            
            for i, track in enumerate(recommendations["tracks"], 1):
                track_name = track["name"]
                artist = track["artists"][0]["name"]
                album = track["album"]["name"]
                print(f"{i}. {track_name}")
                print(f"   Artist: {artist}")
                print(f"   Album: {album}")
                print(f"   Spotify URL: {track['external_urls']['spotify']}")
                print()
    
    # =============================================================================
    # EXAMPLE 2: Recommendations based on GENRES
    # =============================================================================
    print("=" * 70)
    print("EXAMPLE 2: Get recommendations based on genres")
    print("=" * 70)
    print()
    
    # Popular genres: rock, pop, hip-hop, jazz, classical, electronic, blues, etc.
    genres = ["blues", "rock"]
    print(f"Getting recommendations for genres: {', '.join(genres)}...")
    
    recommendations = get_recommendations(
        access_token,
        seed_genres=genres,
        limit=5
    )
    
    if recommendations and "tracks" in recommendations:
        print(f"\n✓ Found {len(recommendations['tracks'])} recommendations:\n")
        
        for i, track in enumerate(recommendations["tracks"], 1):
            track_name = track["name"]
            artist = track["artists"][0]["name"]
            print(f"{i}. {track_name} - {artist}")
    
    print()
    
    # =============================================================================
    # EXAMPLE 3: Recommendations based on a TRACK
    # =============================================================================
    print("=" * 70)
    print("EXAMPLE 3: Get recommendations based on a track")
    print("=" * 70)
    print()
    
    # Search for a track
    track_id, track_name, artist_name = search_track(
        access_token, 
        "Psycho Killer", 
        "Talking Heads"
    )
    
    if track_id:
        print(f"Found track: {track_name} by {artist_name}")
        print(f"Track ID: {track_id}")
        print()
        print("Getting similar tracks...")
        
        recommendations = get_recommendations(
            access_token,
            seed_tracks=[track_id],
            limit=5
        )
        
        if recommendations and "tracks" in recommendations:
            print(f"\n✓ Found {len(recommendations['tracks'])} similar tracks:\n")
            
            for i, track in enumerate(recommendations["tracks"], 1):
                track_name = track["name"]
                artist = track["artists"][0]["name"]
                print(f"{i}. {track_name} - {artist}")

print("\n" + "=" * 70)
print("INSTRUCTIONS:")
print("=" * 70)
print("1. Replace CLIENT_ID and CLIENT_SECRET at the top")
print("2. Run: python spotify_recommendations.py")
print()
print("You can modify the examples to use different artists, tracks, or genres!")
