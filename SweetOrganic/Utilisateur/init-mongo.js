db = db.getSiblingDB('sweetorganic');

db.admins.insert([

    {
        "nom": "ADRIEN",
        "prenom": "Benjamin",
        "email": "adrien.benjamin@sweetorganic.com",
        "password": "$2y$10$ZwOzM/oZFuGM96poddnEu.QDcO5Chap22.0s4kn61ApxO5lYbIsCe",
        "permissions": [
        ]
    },
    {
        "nom": "REVEL",
        "prenom": "Brice",
        "email": "revel.brice@sweetorganic.com",
        "password": "$2y$10$EtaxOocaFOC5nLGBjQe93eE99iY/D79I8gRvu1kWrlxJKNxTj1R6e",
        "permissions": [
        ]
    }

]

);
