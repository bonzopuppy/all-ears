import SearchBar from "./SearchBar";
import ListContainerWrapper from "./ListContainerWrapper";
import GenreCarousel from "./GenreCarousel";
import SearchResults from "./SearchResults";

function Home({ setSearchResults, searchResults, newReleases, whatsHot, handleRefresh, genres, accessToken, market }) {
    return (
        <>
            <SearchBar
                accessToken={accessToken}
                onResultsFetched={setSearchResults}
            />
            {searchResults ? (
                <SearchResults results={searchResults} />
            ) : (
                <>
                    <ListContainerWrapper
                        newReleases={newReleases}
                        whatsHot={whatsHot}
                        handleRefresh={handleRefresh}
                        accessToken={accessToken}
                    />
                    <GenreCarousel genres={genres} />
                </>
            )}
        </>
    )
}

export default Home;
