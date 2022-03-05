export const ARTWORKS = {
    "sunflowers": {
        artist: "Vincent van Gogh",
        title: "Sunflowers",
        year: "1888",
    },
    "the_starry_night": {
        artist: "Vincent van Gogh",
        title: "The Starry Night",
        year: "1889",
    },
    "guernica": {
        artist: "Pablo Picasso",
        title: "Guernica",
        year: "1937",
    },
    "the_weeping_woman": {
        artist: "Pablo Picasso",
        title: "The Weeping Woman",
        year: "1937",
    },
    "the_persistence_of_memory": {
        artist: "Salvador Dalí",
        title: "The Persistence of Memory",
        year: "1931",
    },
    "the_scream": {
        artist: "Edvard Munch",
        title: "The Scream",
        year: "1893",
    },
    "the_great_wave_off_kanagawa": {
        artist: "Katsushika Hokusai",
        title: "The Great Wave off Kanagawa",
        year: "1831",
    },
    "fine_wind_clear_morning": {
        artist: "Katsushika Hokusai",
        title: "Fine Wind, Clear Morning",
        year: "1832",
    },
    "mona_lisa": {
        artist: "Leonardo da Vinci",
        title: "Mona Lisa",
        year: "1517",
    },
    "happy_tears": {
        artist: "Roy Lichtenstein",
        title: "Happy Tears",
        year: "1964",
    }
}

// Image loaded event 
export const eventImageLoaded = new CustomEvent('imageLoaded', { bubbles: true })