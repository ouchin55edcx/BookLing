export const BOOKS = [
    {
        id: '1',
        title: 'The Great Dinosaur Detective Agency!',
        image: require('@/assets/images/book1.jpg'),
        category: 'Animal Tales',
        description: 'Join the dinosaurs as they solve the greatest mystery of the prehistoric world!',
        chapters: getCommonChapters()
    },
    {
        id: '2',
        title: 'The Mysterious Fairy Garden Escape!',
        image: require('@/assets/images/book2.jpg'),
        category: 'Magic World',
        description: 'A magical journey through a hidden garden where every flower tells a story.',
        chapters: getCommonChapters()
    },
    {
        id: '3',
        title: 'The Fantastic Robot Invention Fair!',
        image: require('@/assets/images/book3.jpg'),
        category: 'Space & Stars',
        description: 'Discover the most amazing robots ever built in this high-tech adventure!',
        chapters: getCommonChapters()
    },
    {
        id: '4',
        title: 'The Grand Dragon Baking Championship!',
        image: require('@/assets/images/book4.jpg'),
        category: 'Magic World',
        description: 'Four friendly dragons compete to bake the most magical cake in the kingdom.',
        chapters: getCommonChapters()
    },
    {
        id: '5',
        title: 'The Magical Winter Sled Race!',
        image: require('@/assets/images/book5.jpg'),
        category: 'Animal Tales',
        description: 'Race through the snow with yeti, polar bears, and magical forest friends!',
        chapters: getCommonChapters()
    },
    {
        id: '6',
        title: 'The Magical Underwater Rescue!',
        image: require('@/assets/images/book6.jpg'),
        category: 'Magic World',
        description: 'Dive deep into the ocean to save the mermaid kingdom with your dolphin friends.',
        chapters: getCommonChapters()
    },
    {
        id: '7',
        title: 'The Fantastic Space Pirate Party!',
        image: require('@/assets/images/book7.jpg'),
        category: 'Space & Stars',
        description: 'Join the space pirates for the biggest party in the galaxy!',
        chapters: getCommonChapters()
    },
    {
        id: '8',
        title: 'The Magical Treehouse Adventure',
        image: require('@/assets/images/book8.jpg'),
        category: 'Magic World',
        description: 'Join Luna, a curious little star, as she discovers the magic of books in her treehouse.',
        chapters: getCommonChapters()
    },
];

function getCommonChapters() {
    return [
        {
            id: '1',
            title: 'The Great Gathering',
            content: 'The air in Snowflake Valley was crisp and filled with the scent of pine. Every year, when the moon shone at its brightest, the creatures and children of the woods gathered for the most famous event in the north: The Magical Winter Sled Race. From every corner of the frozen forest, racers arrived on their unique sleds—some pulled by polar bears, others by owls, and some even floating on enchanted ice blocks.',
            image: require('@/assets/images/sled-race-ch1.jpg')
        },
        {
            id: '2',
            title: 'Through the Yeti’s Pass',
            content: 'As the race began, the path narrowed into the treacherous Yeti’s Pass. Giant ice crystals glowed with a blue light, illuminating the way. Suddenly, a friendly Yeti appeared on his own wooden skis, sliding down the mountain with a loud "Whoop!" He wasn\'t there to stop them; he was there to show them the secret shortcut through the glowing pine trees.',
            image: require('@/assets/images/sled-race-ch2.jpg')
        },
        {
            id: '3',
            title: 'The Forest of Flight',
            content: 'The trail soon turned into a magical ice slide that curved upward. "Hold on tight!" Lily shouted as her reindeer sled took flight for a brief moment. Tiny winter fairies fluttered beside the racers, sprinkling stardust that made the sleds move even faster. In this part of the forest, the snow didn\'t just fall; it danced in patterns of stars and swirls.',
            image: require('@/assets/images/sled-race-ch3.jpg')
        }
    ];
}
