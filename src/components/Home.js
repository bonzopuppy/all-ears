import { useState } from "react";
import SearchBar from "./SearchBar";
import ListContainerWrapper from "./ListContainerWrapper";
import GenreCarousel from "./GenreCarousel";
import SearchResults from "./SearchResults";

function Home({ setSearchResults, searchResults, newReleases, forYou, recentlyPlayed, handleRefresh, genres, accessToken, market, newReleasesCategoryId, newReleasesCategoryTitle, forYouCategoryId, forYouCategoryTitle }) {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <>
            <SearchBar
                accessToken={accessToken}
                onResultsFetched={setSearchResults}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            {searchResults ? (
                <SearchResults
                    results={searchResults}
                    accessToken={accessToken}
                    onSearch={setSearchResults}
                    setSearchQuery={setSearchQuery}
                />
            ) : (
                <>
                    <ListContainerWrapper
                        newReleases={newReleases}
                        forYou={forYou}
                        recentlyPlayed={recentlyPlayed}
                        handleRefresh={handleRefresh}
                        accessToken={accessToken}
                        newReleasesCategoryId={newReleasesCategoryId}
                        newReleasesCategoryTitle={newReleasesCategoryTitle}
                        forYouCategoryId={forYouCategoryId}
                        forYouCategoryTitle={forYouCategoryTitle}
                    />
                    <GenreCarousel genres={genres} />
                </>
            )}
        </>
    )
}

export default Home;
