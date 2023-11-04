db = db.getSiblingDB('sweetorganic');

db.products.insert([

     {
        "nom": "Guimauve à la framboise",
        "description": "Guimauves fruitées avec une touche acidulée de framboise. Idéales pour les soirées douillettes.",
        "prix": 2.50,
        "stock": 200,
        "categorie": "guimauve",
        "ingredients": ["sucre", "sirop de maïs", "gélatine", "arôme naturel de framboise"],
        "image": {
            "url": "http://localhost:3026/images/guimauve-framboise.png",
            "alt": "Guimauve à la framboise"
        },
        "avisIds": [],
        "statut": "actif"
    },

    {
        "nom": "Bonbons acidulés aux fruits",
        "description": "Mélange de saveurs fruitées avec une touche acidulée. Parfait pour les amateurs de sensations fortes.",
        "prix": 1.50,
        "stock": 300,
        "categorie": "bonbon",
        "ingredients": ["sucre", "sirop de glucose", "acide citrique", "arômes naturels"],
        "image": {
            "url": "http://localhost:3026/images/bonbons-acidules.png",
            "alt": "Bonbons acidulés aux fruits"
        },
        "avisIds": [],
        "statut": "actif"
    },

    {
        "nom": "Tablette de chocolat noir 70%",
        "description": "Chocolat riche et corsé pour les véritables amateurs de cacao. Fabriqué à partir de fèves de cacao de qualité supérieure.",
        "prix": 3.20,
        "stock": 150,
        "categorie": "chocolat",
        "ingredients": ["pâte de cacao", "sucre", "beurre de cacao", "vanille"],
        "image": {
            "url": "http://localhost:3026/images/chocolat-noir.png",
            "alt": "Tablette de chocolat noir 70%"
        },
        "avisIds": [],
        "statut": "actif"
    },

    // Autre produit pour la catégorie: guimauve
{
    "nom": "Guimauve au chocolat",
    "description": "Guimauves moelleuses enrobées de chocolat fondant. Un mariage parfait pour les gourmands.",
    "prix": 3.00,
    "stock": 180,
    "categorie": "guimauve",
    "ingredients": ["sucre", "sirop de maïs", "gélatine", "chocolat", "arôme naturel de vanille"],
    "image": {
        "url": "http://localhost:3026/images/guimauve-chocolat.png",
        "alt": "Guimauve au chocolat"
    },
    "avisIds": [],
    "statut": "actif"
},
// Autre produit pour la catégorie: bonbon
{
    "nom": "Bonbons pétillants à la cerise",
    "description": "Bonbons sucrés qui crépitent dans la bouche, offrant une expérience amusante et délicieuse.",
    "prix": 1.70,
    "stock": 280,
    "categorie": "bonbon",
    "ingredients": ["sucre", "lactose", "dioxyde de carbone", "arôme naturel de cerise"],
    "image": {
        "url": "http://localhost:3026/images/bonbons-petillants.png",
        "alt": "Bonbons pétillants à la cerise"
    },
    "avisIds": [],
    "statut": "actif"
},
// Autre produit pour la catégorie: chocolat
{
    "nom": "Chocolat blanc à la noix de coco",
    "description": "Tablette de chocolat blanc crémeux parsemée de copeaux de noix de coco. Une sensation tropicale à chaque bouchée.",
    "prix": 3.50,
    "stock": 160,
    "categorie": "chocolat",
    "ingredients": ["sucre", "beurre de cacao", "lait entier en poudre", "noix de coco", "vanille"],
    "image": {
        "url": "http://localhost:3026/images/chocolat-blanc-noix-de-coco.png",
        "alt": "Chocolat blanc à la noix de coco"
    },
    "avisIds": [],
    "statut": "actif"
},

// Autre produit pour la catégorie: guimauve
{
    "nom": "Guimauve au chocolat",
    "description": "Guimauves moelleuses enrobées de chocolat fondant. Un mariage parfait pour les gourmands.",
    "prix": 3.00,
    "stock": 180,
    "categorie": "guimauve",
    "ingredients": ["sucre", "sirop de maïs", "gélatine", "chocolat", "arôme naturel de vanille"],
    "image": {
        "url": "http://localhost:3026/images/guimauve-chocolat.png",
        "alt": "Guimauve au chocolat"
    },
    "avisIds": [],
    "statut": "actif"
},
// Autre produit pour la catégorie: bonbon
{
    "nom": "Bonbons pétillants à la cerise",
    "description": "Bonbons sucrés qui crépitent dans la bouche, offrant une expérience amusante et délicieuse.",
    "prix": 1.70,
    "stock": 280,
    "categorie": "bonbon",
    "ingredients": ["sucre", "lactose", "dioxyde de carbone", "arôme naturel de cerise"],
    "image": {
        "url": "http://localhost:3026/images/bonbons-petillants.png",
        "alt": "Bonbons pétillants à la cerise"
    },
    "avisIds": [],
    "statut": "actif"
},
// Autre produit pour la catégorie: chocolat
{
    "nom": "Chocolat blanc à la noix de coco",
    "description": "Tablette de chocolat blanc crémeux parsemée de copeaux de noix de coco. Une sensation tropicale à chaque bouchée.",
    "prix": 3.50,
    "stock": 160,
    "categorie": "chocolat",
    "ingredients": ["sucre", "beurre de cacao", "lait entier en poudre", "noix de coco", "vanille"],
    "image": {
        "url": "http://localhost:3026/images/chocolat-blanc-noix-de-coco.png",
        "alt": "Chocolat blanc à la noix de coco"
    },
    "avisIds": [],
    "statut": "actif"
},

// ...

// Guimauves
{
    "nom": "Guimauve au caramel salé",
    "description": "Guimauves douces infusées d'un riche caramel salé. Un équilibre parfait entre douceur et salinité.",
    "prix": 3.10,
    "stock": 190,
    "categorie": "guimauve",
    "ingredients": ["sucre", "sirop de maïs", "gélatine", "caramel", "sel"],
    "image": {
        "url": "http://localhost:3026/images/guimauve-caramel.png",
        "alt": "Guimauve au caramel salé"
    },
    "avisIds": [],
    "statut": "actif"
},
{
    "nom": "Guimauve au citron",
    "description": "Des guimauves acidulées avec une touche zestée de citron. Rafraîchissantes et délicieuses.",
    "prix": 2.90,
    "stock": 205,
    "categorie": "guimauve",
    "ingredients": ["sucre", "sirop de maïs", "gélatine", "arôme naturel de citron", "colorant jaune"],
    "image": {
        "url": "http://localhost:3026/images/guimauve-citron.png",
        "alt": "Guimauve au citron"
    },
    "avisIds": [],
    "statut": "actif"
},
{
    "nom": "Guimauve aux baies sauvages",
    "description": "Un mélange savoureux de baies sauvages dans une guimauve moelleuse. Un voyage gustatif dans la forêt.",
    "prix": 3.00,
    "stock": 180,
    "categorie": "guimauve",
    "ingredients": ["sucre", "sirop de maïs", "gélatine", "arômes naturels de baies", "colorants naturels"],
    "image": {
        "url": "http://localhost:3026/images/guimauve-baies.png",
        "alt": "Guimauve aux baies sauvages"
    },
    "avisIds": [],
    "statut": "actif"
},

// Bonbons
{
    "nom": "Bonbons durs à la pomme verte",
    "description": "Des bonbons durs et brillants à la saveur piquante de pomme verte. Une explosion de saveur à chaque bouchée.",
    "prix": 1.20,
    "stock": 320,
    "categorie": "bonbon",
    "ingredients": ["sucre", "sirop de glucose", "acide malique", "arôme naturel de pomme"],
    "image": {
        "url": "http://localhost:3026/images/bonbons-pomme.png",
        "alt": "Bonbons durs à la pomme verte"
    },
    "avisIds": [],
    "statut": "actif"
},
{
    "nom": "Bonbons gélifiés en forme d'oursons",
    "description": "Des petits oursons colorés et moelleux aux saveurs variées. Parfaits pour une petite gourmandise.",
    "prix": 1.80,
    "stock": 275,
    "categorie": "bonbon",
    "ingredients": ["sucre", "sirop de glucose", "gélatine", "arômes naturels", "colorants naturels"],
    "image": {
        "url": "http://localhost:3026/images/bonbons-oursons.png",
        "alt": "Bonbons gélifiés en forme d'oursons"
    },
    "avisIds": [],
    "statut": "actif"
},
{
    "nom": "Bonbons à la réglisse douce",
    "description": "Des bonbons torsadés à la saveur riche et complexe de la réglisse. Un classique apprécié de tous.",
    "prix": 1.40,
    "stock": 290,
    "categorie": "bonbon",
    "ingredients": ["mélasse", "farine de blé", "sucre", "sirop de glucose", "arôme de réglisse"],
    "image": {
        "url": "http://localhost:3026/images/bonbons-reglisse.png",
        "alt": "Bonbons à la réglisse douce"
    },
    "avisIds": [],
    "statut": "actif"
},

// Chocolats
{
    "nom": "Chocolat noir aux éclats de café",
    "description": "Chocolat noir intense parsemé d'éclats de grains de café torréfiés. Un réveil pour les papilles.",
    "prix": 4.00,
    "stock": 140,
    "categorie": "chocolat",
    "ingredients": ["pâte de cacao", "sucre", "beurre de cacao", "grains de café", "vanille"],
    "image": {
        "url": "http://localhost:3026/images/chocolat-cafe.png",
        "alt": "Chocolat noir aux éclats de café"
    },
    "avisIds": [],
    "statut": "actif"
},

]);
