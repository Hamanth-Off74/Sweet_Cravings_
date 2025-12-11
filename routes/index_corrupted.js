const express = require('express');
const router = express.Router();

// Static dessert data
const desserts = [
    // Cakes Category (12 items)
    {
        _id: '1',
        name: 'Chocolate Cake',
        description: 'Rich and moist chocolate cake with a creamy fudge frosting.',
        price: 2100.00,
        originalPrice: 2900.00,
        discount: 29,
        rating: 4.5,
        reviews: 234,
        imageURL: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop',
        category: 'Cakes'
    },
    {
        _id: '2',
        name: 'Cheesecake',
        description: 'Classic New York style cheesecake with a graham cracker crust.',
        price: 1650.00,
        originalPrice: 2100.00,
        discount: 20,
        rating: 4.3,
        reviews: 189,
        imageURL: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=300&h=200&fit=crop',
        category: 'Cakes'
    },
    {
        _id: '5',
        name: 'Red Velvet Cake',
        description: 'A layered red-hued cake with a smooth cream cheese frosting.',
        price: 2300.00,
        originalPrice: 2900.00,
        discount: 20,
        rating: 4.4,
        reviews: 167,
        imageURL: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=300&h=200&fit=crop',
        category: 'Cakes'
    },
    {
        _id: '7',
        name: 'Strawberry Shortcake',
        description: 'Fresh strawberries with whipped cream on a light sponge cake.',
        price: 1980.00,
        originalPrice: 2500.00,
        discount: 20,
        rating: 4.5,
        reviews: 201,
        imageURL: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&h=200&fit=crop',
        category: 'Cakes'
    },
    {
        _id: '8',
        name: 'Vanilla Bean Cake',
        description: 'Classic vanilla cake with real vanilla bean buttercream frosting.',
        price: 1850.00,
        originalPrice: 2300.00,
        discount: 19,
        rating: 4.2,
        reviews: 145,
        imageURL: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop',
        category: 'Cakes'
    },
    {
        _id: '9',
        name: 'Carrot Cake',
        description: 'Moist spiced cake with carrots, topped with cream cheese frosting.',
        price: 2050.00,
        originalPrice: 2600.00,
        discount: 21,
        rating: 4.3,
        reviews: 178,
        imageURL: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=300&h=200&fit=crop',
        category: 'Cakes'
    },
    {
        _id: '10',
        name: 'Black Forest Cake',
        description: 'Chocolate sponge cake with cherries and whipped cream layers.',
        price: 2450.00,
        originalPrice: 3100.00,
        discount: 21,
        rating: 4.6,
        reviews: 289,
        imageURL: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop',
        category: 'Cakes'
    },
    {
        _id: '25',
        name: 'Lemon Cake',
        description: 'Zesty lemon cake with tangy lemon cream cheese frosting.',
        price: 1950.00,
        originalPrice: 2450.00,
        discount: 20,
        rating: 4.4,
        reviews: 156,
        imageURL: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=300&h=200&fit=crop',
        category: 'Cakes'
    },
    {
        _id: '26',
        name: 'Coconut Cake',
        description: 'Tropical coconut cake with coconut flakes and cream frosting.',
        price: 2100.00,
        originalPrice: 2650.00,
        discount: 21,
        rating: 4.3,
        reviews: 132,
        imageURL: 'https://images.unsplash.com/photo-1587736412491-eeda0cc58f14?w=300&h=200&fit=crop',
        category: 'Cakes'
    },
    {
        _id: '27',
        name: 'Funfetti Birthday Cake',
        description: 'Colorful sprinkled vanilla cake perfect for celebrations.',
        price: 1800.00,
        originalPrice: 2250.00,
        discount: 20,
        rating: 4.5,
        reviews: 245,
        imageURL: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
        category: 'Cakes'
    },
    {
        _id: '28',
        name: 'Marble Cake',
        description: 'Swirled vanilla and chocolate cake with rich buttercream.',
        price: 1900.00,
        originalPrice: 2400.00,
        discount: 21,
        rating: 4.2,
        reviews: 167,
        imageURL: 'https://images.unsplash.com/photo-1549312847-6b2fc6b27b5c?w=300&h=200&fit=crop',
        category: 'Cakes'
    },
    {
        _id: '29',
        name: 'Coffee Cake',
        description: 'Rich coffee-flavored cake with cinnamon streusel topping.',
        price: 2000.00,
        originalPrice: 2550.00,
        discount: 22,
        rating: 4.4,
        reviews: 189,
        imageURL: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=300&h=200&fit=crop',
        category: 'Cakes'
    },

    // Cookies Category (11 items)
    {
        _id: '11',
        name: 'Chocolate Chip Cookies',
        description: 'Classic chocolate chip cookies with a perfect chewy texture.',
        price: 850.00,
        originalPrice: 1000.00,
        discount: 15,
        rating: 4.6,
        reviews: 312,
        imageURL: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&h=200&fit=crop',
        category: 'Cookies'
    },
    {
        _id: '12',
        name: 'Oatmeal Raisin Cookies',
        description: 'Hearty oatmeal cookies with plump raisins and cinnamon.',
        price: 750.00,
        originalPrice: 950.00,
        discount: 21,
        rating: 4.2,
        reviews: 198,
        imageURL: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&h=200&fit=crop',
        category: 'Cookies'
    },
    {
        _id: '13',
        name: 'Sugar Cookies',
        description: 'Soft and sweet sugar cookies with a delicate vanilla flavor.',
        price: 700.00,
        originalPrice: 900.00,
        discount: 22,
        rating: 4.3,
        reviews: 167,
        imageURL: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop',
        category: 'Cookies'
    },
    {
        _id: '14',
        name: 'Snickerdoodle Cookies',
        description: 'Cinnamon-sugar coated cookies with a soft, chewy center.',
        price: 800.00,
        originalPrice: 1050.00,
        discount: 24,
        rating: 4.4,
        reviews: 223,
        imageURL: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=300&h=200&fit=crop',
        category: 'Cookies'
    },
    {
        _id: '30',
        name: 'Double Chocolate Cookies',
        description: 'Rich chocolate cookies loaded with chocolate chips.',
        price: 900.00,
        originalPrice: 1150.00,
        discount: 22,
        rating: 4.5,
        reviews: 278,
        imageURL: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=300&h=200&fit=crop',
        category: 'Cookies'
    },
    {
        _id: '31',
        name: 'Peanut Butter Cookies',
        description: 'Classic peanut butter cookies with a perfect criss-cross pattern.',
        price: 850.00,
        originalPrice: 1100.00,
        discount: 23,
        rating: 4.3,
        reviews: 198,
        imageURL: 'https://images.unsplash.com/photo-1486548129815-d0853b6c6a99?w=300&h=200&fit=crop',
        category: 'Cookies'
    },
    {
        _id: '32',
        name: 'Gingerbread Cookies',
        description: 'Spiced gingerbread cookies with warm holiday flavors.',
        price: 750.00,
        originalPrice: 950.00,
        discount: 21,
        rating: 4.4,
        reviews: 156,
        imageURL: 'https://images.unsplash.com/photo-1545365453-8143da5a1bff?w=300&h=200&fit=crop',
        category: 'Cookies'
    },
    {
        _id: '33',
        name: 'White Chocolate Macadamia',
        description: 'Buttery cookies with white chocolate chips and macadamia nuts.',
        price: 950.00,
        originalPrice: 1200.00,
        discount: 21,
        rating: 4.5,
        reviews: 234,
        imageURL: 'https://images.unsplash.com/photo-1595587871905-ee5abb0e23ff?w=300&h=200&fit=crop',
        category: 'Cookies'
    },
    {
        _id: '34',
        name: 'Lemon Cookies',
        description: 'Zesty lemon cookies with a tangy glaze finish.',
        price: 800.00,
        originalPrice: 1000.00,
        discount: 20,
        rating: 4.2,
        reviews: 145,
        imageURL: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=300&h=200&fit=crop',
        category: 'Cookies'
    },
    {
        _id: '35',
        name: 'Shortbread Cookies',
        description: 'Buttery Scottish shortbread cookies with a crumbly texture.',
        price: 750.00,
        originalPrice: 950.00,
        discount: 21,
        rating: 4.3,
        reviews: 167,
        imageURL: 'https://images.unsplash.com/photo-1567327288192-bedde7de6e4b?w=300&h=200&fit=crop',
        category: 'Cookies'
    },
    {
        _id: '36',
        name: 'Molasses Cookies',
        description: 'Soft and chewy molasses cookies with warm spices.',
        price: 800.00,
        originalPrice: 1050.00,
        discount: 24,
        rating: 4.1,
        reviews: 123,
        imageURL: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=200&fit=crop',
        category: 'Cookies'
    },

    // Pies Category (10 items)
    {
        _id: '15',
        name: 'Apple Pie',
        description: 'Traditional apple pie with cinnamon spiced filling and flaky crust.',
        price: 1400.00,
        originalPrice: 1750.00,
        discount: 20,
        rating: 4.5,
        reviews: 267,
        imageURL: 'https://images.unsplash.com/photo-1535920527002-b35e96722be4?w=300&h=200&fit=crop',
        category: 'Pies'
    },
    {
        _id: '16',
        name: 'Pumpkin Pie',
        description: 'Creamy pumpkin pie with aromatic spices and whipped cream.',
        price: 1350.00,
        originalPrice: 1700.00,
        discount: 21,
        rating: 4.3,
        reviews: 189,
        imageURL: 'https://images.unsplash.com/photo-1509461399763-ae67a981b254?w=300&h=200&fit=crop',
        category: 'Pies'
    },
    {
        _id: '17',
        name: 'Cherry Pie',
        description: 'Sweet and tart cherry pie with a golden lattice crust.',
        price: 1500.00,
        originalPrice: 1900.00,
        discount: 21,
        rating: 4.4,
        reviews: 198,
        imageURL: 'https://images.unsplash.com/photo-1551218372-a8789b81b253?w=300&h=200&fit=crop',
        category: 'Pies'
    },
    {
        _id: '37',
        name: 'Pecan Pie',
        description: 'Rich and gooey pecan pie with a buttery crust.',
        price: 1650.00,
        originalPrice: 2100.00,
        discount: 21,
        rating: 4.5,
        reviews: 234,
        imageURL: 'https://images.unsplash.com/photo-1509461399763-ae67a981b254?w=300&h=200&fit=crop',
        category: 'Pies'
    },
    {
        _id: '38',
        name: 'Blueberry Pie',
        description: 'Fresh blueberry pie with a flaky, golden crust.',
        price: 1450.00,
        originalPrice: 1850.00,
        discount: 22,
        rating: 4.4,
        reviews: 178,
        imageURL: 'https://images.unsplash.com/photo-1464195643332-1f236b1c2255?w=300&h=200&fit=crop',
        category: 'Pies'
    },
    {
        _id: '39',
        name: 'Key Lime Pie',
        description: 'Tangy key lime pie with graham cracker crust and whipped cream.',
        price: 1550.00,
        originalPrice: 1950.00,
        discount: 21,
        rating: 4.3,
        reviews: 156,
        imageURL: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=200&fit=crop',
        category: 'Pies'
    },
    {
        _id: '40',
        name: 'Lemon Meringue Pie',
        description: 'Tart lemon filling topped with fluffy meringue.',
        price: 1600.00,
        originalPrice: 2000.00,
        discount: 20,
        rating: 4.5,
        reviews: 267,
        imageURL: 'https://images.unsplash.com/photo-1551218372-a8789b81b253?w=300&h=200&fit=crop',
        category: 'Pies'
    },
    {
        _id: '41',
        name: 'Chocolate Cream Pie',
        description: 'Rich chocolate cream pie with whipped cream topping.',
        price: 1700.00,
        originalPrice: 2150.00,
        discount: 21,
        rating: 4.6,
        reviews: 289,
        imageURL: 'https://images.unsplash.com/photo-1567327288192-bedde7de6e4b?w=300&h=200&fit=crop',
        category: 'Pies'
    },
    {
        _id: '42',
        name: 'Banana Cream Pie',
        description: 'Creamy banana pie with vanilla wafers and whipped cream.',
        price: 1500.00,
        originalPrice: 1900.00,
        discount: 21,
        rating: 4.2,
        reviews: 145,
        imageURL: 'https://images.unsplash.com/photo-1509461399763-ae67a981b254?w=300&h=200&fit=crop',
        category: 'Pies'
    },
    {
        _id: '43',
        name: 'Coconut Cream Pie',
        description: 'Tropical coconut cream pie with toasted coconut flakes.',
        price: 1550.00,
        originalPrice: 1950.00,
        discount: 21,
        rating: 4.3,
        reviews: 167,
        imageURL: 'https://images.unsplash.com/photo-1587736412491-eeda0cc58f14?w=300&h=200&fit=crop',
        category: 'Pies'
    },

    // Italian Category (10 items)
    {
        _id: '4',
        name: 'Tiramisu',
        description: 'Coffee-flavored Italian dessert with mascarpone cheese.',
        price: 1850.00,
        originalPrice: 2350.00,
        discount: 21,
        rating: 4.7,
        reviews: 298,
        imageURL: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop',
        category: 'Italian'
    },
    {
        _id: '21',
        name: 'Panna Cotta',
        description: 'Silky smooth Italian custard dessert with berry compote.',
        price: 1200.00,
        originalPrice: 1500.00,
        discount: 20,
        rating: 4.4,
        reviews: 156,
        imageURL: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop',
        category: 'Italian'
    },
    {
        _id: '44',
        name: 'Cannoli',
        description: 'Crispy Sicilian pastry shells filled with sweet ricotta cream.',
        price: 950.00,
        originalPrice: 1200.00,
        discount: 21,
        rating: 4.5,
        reviews: 234,
        imageURL: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=300&h=200&fit=crop',
        category: 'Italian'
    },
    {
        _id: '45',
        name: 'Gelato',
        description: 'Authentic Italian gelato in various flavors.',
        price: 850.00,
        originalPrice: 1100.00,
        discount: 23,
        rating: 4.6,
        reviews: 345,
        imageURL: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&h=200&fit=crop',
        category: 'Italian'
    },
    {
        _id: '46',
        name: 'Sfogliatelle',
        description: 'Flaky pastry shells filled with ricotta and candied fruit.',
        price: 1100.00,
        originalPrice: 1400.00,
        discount: 21,
        rating: 4.3,
        reviews: 167,
        imageURL: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=300&h=200&fit=crop',
        category: 'Italian'
    },
    {
        _id: '47',
        name: 'Affogato',
        description: 'Vanilla gelato "drowned" in hot espresso coffee.',
        price: 750.00,
        originalPrice: 950.00,
        discount: 21,
        rating: 4.4,
        reviews: 189,
        imageURL: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&h=200&fit=crop',
        category: 'Italian'
    },
    {
        _id: '48',
        name: 'Zabaglione',
        description: 'Light Italian custard made with egg yolks and sweet wine.',
        price: 1000.00,
        originalPrice: 1300.00,
        discount: 23,
        rating: 4.2,
        reviews: 123,
        imageURL: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop',
        category: 'Italian'
    },
    {
        _id: '49',
        name: 'Amaretti',
        description: 'Traditional Italian almond cookies with a chewy texture.',
        price: 900.00,
        originalPrice: 1150.00,
        discount: 22,
        rating: 4.3,
        reviews: 156,
        imageURL: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop',
        category: 'Italian'
    },
    {
        _id: '50',
        name: 'Granita',
        description: 'Sicilian frozen dessert with semi-frozen texture.',
        price: 700.00,
        originalPrice: 900.00,
        discount: 22,
        rating: 4.1,
        reviews: 134,
        imageURL: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&h=200&fit=crop',
        category: 'Italian'
    },
    {
        _id: '51',
        name: 'Biscotti',
        description: 'Twice-baked Italian cookies perfect for dipping in coffee.',
        price: 850.00,
        originalPrice: 1100.00,
        discount: 23,
        rating: 4.4,
        reviews: 178,
        imageURL: 'https://images.unsplash.com/photo-1567327288192-bedde7de6e4b?w=300&h=200&fit=crop',
        category: 'Italian'
    },

    // Brownies Category (10 items)
    {
        _id: '18',
        name: 'Classic Fudge Brownies',
        description: 'Rich and dense chocolate brownies with a fudgy texture.',
        price: 1100.00,
        originalPrice: 1400.00,
        discount: 21,
        rating: 4.5,
        reviews: 234,
        imageURL: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop',
        category: 'Brownies'
    },
    {
        _id: '19',
        name: 'Salted Caramel Brownies',
        description: 'Decadent brownies with swirls of salted caramel.',
        price: 1250.00,
        originalPrice: 1600.00,
        discount: 22,
        rating: 4.6,
        reviews: 289,
        imageURL: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=300&h=200&fit=crop',
        category: 'Brownies'
    },
    {
        _id: '52',
        name: 'Walnut Brownies',
        description: 'Classic brownies loaded with crunchy walnuts.',
        price: 1150.00,
        originalPrice: 1450.00,
        discount: 21,
        rating: 4.3,
        reviews: 167,
        imageURL: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop',
        category: 'Brownies'
    },
    {
        _id: '53',
        name: 'Cream Cheese Brownies',
        description: 'Fudgy brownies with tangy cream cheese swirls.',
        price: 1300.00,
        originalPrice: 1650.00,
        discount: 21,
        rating: 4.4,
        reviews: 198,
        imageURL: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=300&h=200&fit=crop',
        category: 'Brownies'
    },
    {
        _id: '54',
        name: 'Double Chocolate Brownies',
        description: 'Extra chocolatey brownies with chocolate chips.',
        price: 1200.00,
        originalPrice: 1550.00,
        discount: 23,
        rating: 4.5,
        reviews: 245,
        imageURL: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop',
        category: 'Brownies'
    },
    {
        _id: '55',
        name: 'Peanut Butter Brownies',
        description: 'Rich brownies with creamy peanut butter swirls.',
        price: 1250.00,
        originalPrice: 1600.00,
        discount: 22,
        rating: 4.4,
        reviews: 178,
        imageURL: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=300&h=200&fit=crop',
        category: 'Brownies'
    },
    {
        _id: '56',
        name: 'Mint Chocolate Brownies',
        description: 'Fudgy brownies with refreshing mint chocolate topping.',
        price: 1300.00,
        originalPrice: 1650.00,
        discount: 21,
        rating: 4.2,
        reviews: 134,
        imageURL: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop',
        category: 'Brownies'
    },
    {
        _id: '57',
        name: 'Espresso Brownies',
        description: 'Coffee-infused brownies for the perfect caffeine kick.',
        price: 1200.00,
        originalPrice: 1500.00,
        discount: 20,
        rating: 4.3,
        reviews: 156,
        imageURL: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=300&h=200&fit=crop',
        category: 'Brownies'
    },
    {
        _id: '58',
        name: 'White Chocolate Brownies',
        description: 'Unique brownies made with white chocolate and vanilla.',
        price: 1250.00,
        originalPrice: 1600.00,
        discount: 22,
        rating: 4.1,
        reviews: 123,
        imageURL: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=300&h=200&fit=crop',
        category: 'Brownies'
    },
    {
        _id: '59',
        name: 'Rocky Road Brownies',
        description: 'Brownies loaded with marshmallows, nuts, and chocolate chips.',
        price: 1350.00,
        originalPrice: 1700.00,
        discount: 21,
        rating: 4.5,
        reviews: 234,
        imageURL: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=300&h=200&fit=crop',
        category: 'Brownies'
    },

    // Tarts Category (10 items)
    {
        _id: '22',
        name: 'Lemon Tart',
        description: 'Tangy lemon curd tart with a buttery pastry shell.',
        price: 1300.00,
        originalPrice: 1650.00,
        discount: 21,
        rating: 4.4,
        reviews: 178,
        imageURL: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=300&h=200&fit=crop',
        category: 'Tarts'
    },
    {
        _id: '23',
        name: 'Chocolate Tart',
        description: 'Rich chocolate ganache tart with a crisp pastry base.',
        price: 1450.00,
        originalPrice: 1850.00,
        discount: 22,
        rating: 4.5,
        reviews: 198,
        imageURL: 'https://images.unsplash.com/photo-1567327288192-bedde7de6e4b?w=300&h=200&fit=crop',
        category: 'Tarts'
    },
    {
        _id: '60',
        name: 'Strawberry Tart',
        description: 'Fresh strawberry tart with vanilla pastry cream.',
        price: 1400.00,
        originalPrice: 1750.00,
        discount: 20,
        rating: 4.3,
        reviews: 167,
        imageURL: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&h=200&fit=crop',
        category: 'Tarts'
    },
    {
        _id: '61',
        name: 'Apple Tart',
        description: 'Traditional French apple tart with almond cream.',
        price: 1350.00,
        originalPrice: 1700.00,
        discount: 21,
        rating: 4.4,
        reviews: 189,
        imageURL: 'https://images.unsplash.com/photo-1535920527002-b35e96722be4?w=300&h=200&fit=crop',
        category: 'Tarts'
    },
    {
        _id: '62',
        name: 'Peach Tart',
        description: 'Summer peach tart with honey glaze and pastry cream.',
        price: 1450.00,
        originalPrice: 1850.00,
        discount: 22,
        rating: 4.2,
        reviews: 145,
        imageURL: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&h=200&fit=crop',
        category: 'Tarts'
    },
    {
        _id: '63',
        name: 'Berry Tart',
        description: 'Mixed berry tart with vanilla custard and fresh berries.',
        price: 1500.00,
        originalPrice: 1900.00,
        discount: 21,
        rating: 4.5,
        reviews: 234,
        imageURL: 'https://images.unsplash.com/photo-1464195643332-1f236b1c2255?w=300&h=200&fit=crop',
        category: 'Tarts'
    },
    {
        _id: '64',
        name: 'Caramel Tart',
        description: 'Decadent salted caramel tart with chocolate pastry.',
        price: 1550.00,
        originalPrice: 1950.00,
        discount: 21,
        rating: 4.6,
        reviews: 267,
        imageURL: 'https://images.unsplash.com/photo-1567327288192-bedde7de6e4b?w=300&h=200&fit=crop',
        category: 'Tarts'
    },
    {
        _id: '65',
        name: 'Coconut Tart',
        description: 'Tropical coconut tart with toasted coconut flakes.',
        price: 1400.00,
        originalPrice: 1750.00,
        discount: 20,
        rating: 4.3,
        reviews: 156,
        imageURL: 'https://images.unsplash.com/photo-1587736412491-eeda0cc58f14?w=300&h=200&fit=crop',
        category: 'Tarts'
    },
    {
        _id: '66',
        name: 'Pear Tart',
        description: 'Elegant pear tart with almond frangipane and wine poached pears.',
        price: 1500.00,
        originalPrice: 1900.00,
        discount: 21,
        rating: 4.4,
        reviews: 178,
        imageURL: 'https://images.unsplash.com/photo-1535920527002-b35e96722be4?w=300&h=200&fit=crop',
        category: 'Tarts'
    },
    {
        _id: '67',
        name: 'Banana Tart',
        description: 'Creamy banana tart with chocolate ganache drizzle.',
        price: 1350.00,
        originalPrice: 1700.00,
        discount: 21,
        rating: 4.2,
        reviews: 134,
        imageURL: 'https://images.unsplash.com/photo-1567327288192-bedde7de6e4b?w=300&h=200&fit=crop',
        category: 'Tarts'
    },

    // Ice Cream Category (10 items)
    {
        _id: '24',
        name: 'Vanilla Bean Ice Cream',
        description: 'Premium vanilla ice cream made with real vanilla beans.',
        price: 750.00,
        originalPrice: 950.00,
        discount: 21,
        rating: 4.3,
        reviews: 156,
        imageURL: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&h=200&fit=crop',
        category: 'Ice Cream'
    },
    {
        _id: '6',
        name: 'Chocolate Chip Ice Cream',
        description: 'Creamy vanilla ice cream loaded with chocolate chips.',
        price: 800.00,
        originalPrice: 1000.00,
        discount: 20,
        rating: 4.4,
        reviews: 234,
        imageURL: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&h=200&fit=crop',
        category: 'Ice Cream'
    },
    {
        _id: '68',
        name: 'Strawberry Ice Cream',
        description: 'Fresh strawberry ice cream with real fruit pieces.',
        price: 750.00,
        originalPrice: 950.00,
        discount: 21,
        rating: 4.2,
        reviews: 189,
        imageURL: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&h=200&fit=crop',
        category: 'Ice Cream'
    },
    {
        _id: '69',
        name: 'Chocolate Fudge Ice Cream',
        description: 'Rich chocolate ice cream with fudge swirls.',
        price: 850.00,
        originalPrice: 1100.00,
        discount: 23,
        rating: 4.5,
        reviews: 267,
        imageURL: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&h=200&fit=crop',
        category: 'Ice Cream'
    },
    {
        _id: '70',
        name: 'Mint Chocolate Chip Ice Cream',
        description: 'Refreshing mint ice cream with chocolate chips.',
        price: 800.00,
        originalPrice: 1000.00,
        discount: 20,
        rating: 4.3,
        reviews: 178,
        imageURL: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&h=200&fit=crop',
        category: 'Ice Cream'
    },
    {
        _id: '71',
        name: 'Cookies and Cream Ice Cream',
        description: 'Vanilla ice cream with crushed chocolate cookies.',
        price: 850.00,
        originalPrice: 1100.00,
        discount: 23,
        rating: 4.4,
        reviews: 234,
        imageURL: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&h=200&fit=crop',
        category: 'Ice Cream'
    },
    {
        _id: '72',
        name: 'Pistachio Ice Cream',
        description: 'Creamy pistachio ice cream with roasted nuts.',
        price: 900.00,
        originalPrice: 1150.00,
        discount: 22,
        rating: 4.2,
        reviews: 145,
        imageURL: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&h=200&fit=crop',
        category: 'Ice Cream'
    },
    {
        _id: '73',
        name: 'Mango Ice Cream',
        description: 'Tropical mango ice cream made with fresh mangoes.',
        price: 800.00,
        originalPrice: 1000.00,
        discount: 20,
        rating: 4.3,
        reviews: 198,
        imageURL: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&h=200&fit=crop',
        category: 'Ice Cream'
    },
    {
        _id: '74',
        name: 'Salted Caramel Ice Cream',
        description: 'Rich caramel ice cream with sea salt crystals.',
        price: 850.00,
        originalPrice: 1100.00,
        discount: 23,
        rating: 4.5,
        reviews: 256,
        imageURL: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&h=200&fit=crop',
        category: 'Ice Cream'
    },
    {
        _id: '75',
        name: 'Rocky Road Ice Cream',
        description: 'Chocolate ice cream with marshmallows and nuts.',
        price: 900.00,
        originalPrice: 1150.00,
        discount: 22,
        rating: 4.4,
        reviews: 223,
        imageURL: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=300&h=200&fit=crop',
        category: 'Ice Cream'
    }
];
        imageURL: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300&h=200&fit=crop',
        category: 'Cakes'
    },
    {
        _id: '11',
        name: 'Black Forest Cake',
        description: 'Chocolate sponge layered with cherries and whipped cream.',
        price: 2450.00,
        originalPrice: 3100.00,
        discount: 21,
        rating: 4.6,
        reviews: 312,
        imageURL: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop',
        category: 'Cakes'
    },
    {
        _id: '12',
        name: 'Vanilla Bean Cake',
        description: 'Light and fluffy vanilla cake with fresh vanilla bean frosting.',
        price: 1950.00,
        originalPrice: 2400.00,
        discount: 19,
        rating: 4.2,
        reviews: 145,
        imageURL: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=300&h=200&fit=crop',
        category: 'Cakes'
    },

    // Cookies Category (4 items)
    {
        _id: '8',
        name: 'Chocolate Chip Cookies',
        description: 'Classic homemade chocolate chip cookies, crispy outside and soft inside.',
        price: 990.00,
        originalPrice: 1250.00,
        discount: 20,
        rating: 4.3,
        reviews: 89,
        imageURL: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&h=200&fit=crop',
        category: 'Cookies'
    },
    {
        _id: '13',
        name: 'Oatmeal Raisin Cookies',
        description: 'Chewy oatmeal cookies loaded with plump raisins and warm spices.',
        price: 850.00,
        originalPrice: 1100.00,
        discount: 23,
        rating: 4.1,
        reviews: 67,
        imageURL: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=200&fit=crop',
        category: 'Cookies'
    },
    {
        _id: '14',
        name: 'Sugar Cookies',
        description: 'Soft and sweet sugar cookies with a delicate vanilla flavor.',
        price: 750.00,
        originalPrice: 950.00,
        discount: 21,
        rating: 4.0,
        reviews: 54,
        imageURL: 'https://images.unsplash.com/photo-1590080874088-eec64895b423?w=300&h=200&fit=crop',
        category: 'Cookies'
    },
    {
        _id: '15',
        name: 'Double Chocolate Cookies',
        description: 'Rich chocolate cookies with chocolate chips for double the indulgence.',
        price: 1150.00,
        originalPrice: 1400.00,
        discount: 18,
        rating: 4.4,
        reviews: 98,
        imageURL: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=300&h=200&fit=crop',
        category: 'Cookies'
    },

    // Pies Category (3 items)
    {
        _id: '3',
        name: 'Apple Pie',
        description: 'Warm apple pie with a flaky crust, served with a scoop of vanilla ice cream.',
        price: 1480.00,
        originalPrice: 1800.00,
        discount: 18,
        rating: 4.6,
        reviews: 156,
        imageURL: 'https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=300&h=200&fit=crop',
        category: 'Pies'
    },
    {
        _id: '16',
        name: 'Blueberry Pie',
        description: 'Fresh blueberries in a golden pastry crust with a hint of lemon.',
        price: 1650.00,
        originalPrice: 2000.00,
        discount: 18,
        rating: 4.5,
        reviews: 134,
        imageURL: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=300&h=200&fit=crop',
        category: 'Pies'
    },
    {
        _id: '17',
        name: 'Pumpkin Pie',
        description: 'Creamy pumpkin filling with warm spices in a buttery crust.',
        price: 1580.00,
        originalPrice: 1950.00,
        discount: 19,
        rating: 4.3,
        reviews: 87,
        imageURL: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop',
        category: 'Pies'
    },

    // Italian Category (2 items)
    {
        _id: '4',
        name: 'Tiramisu',
        description: 'A coffee-flavoured Italian dessert. Ladyfingers dipped in coffee.',
        price: 1810.00,
        originalPrice: 2300.00,
        discount: 21,
        rating: 4.7,
        reviews: 298,
        imageURL: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop',
        category: 'Italian'
    },
    {
        _id: '18',
        name: 'Cannoli',
        description: 'Sicilian pastry shells filled with sweet ricotta and chocolate chips.',
        price: 1350.00,
        originalPrice: 1700.00,
        discount: 21,
        rating: 4.4,
        reviews: 156,
        imageURL: 'https://images.unsplash.com/photo-1549203386-3bd8b0b7dda8?w=300&h=200&fit=crop',
        category: 'Italian'
    },

    // Brownies Category (2 items)
    {
        _id: '6',
        name: 'Chocolate Brownies',
        description: 'Fudgy chocolate brownies with walnuts, served warm.',
        price: 1230.00,
        originalPrice: 1480.00,
        discount: 17,
        rating: 4.2,
        reviews: 145,
        imageURL: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=300&h=200&fit=crop',
        category: 'Brownies'
    },
    {
        _id: '19',
        name: 'Salted Caramel Brownies',
        description: 'Rich chocolate brownies swirled with salted caramel sauce.',
        price: 1450.00,
        originalPrice: 1750.00,
        discount: 17,
        rating: 4.5,
        reviews: 203,
        imageURL: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=300&h=200&fit=crop',
        category: 'Brownies'
    },

    // Tarts Category (2 items)
    {
        _id: '9',
        name: 'Lemon Tart',
        description: 'Tangy lemon curd in a buttery pastry shell with meringue topping.',
        price: 1560.00,
        originalPrice: 1970.00,
        discount: 21,
        rating: 4.4,
        reviews: 123,
        imageURL: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=300&h=200&fit=crop',
        category: 'Tarts'
    },
    {
        _id: '20',
        name: 'Chocolate Tart',
        description: 'Rich dark chocolate ganache in a crisp chocolate pastry shell.',
        price: 1750.00,
        originalPrice: 2200.00,
        discount: 20,
        rating: 4.6,
        reviews: 167,
        imageURL: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop',
        category: 'Tarts'
    },

    // Ice Cream Category (2 items)
    {
        _id: '10',
        name: 'Ice Cream Sundae',
        description: 'Three scoops of vanilla ice cream with chocolate sauce and cherry.',
        price: 1320.00,
        originalPrice: 1650.00,
        discount: 20,
        rating: 4.6,
        reviews: 234,
        imageURL: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=300&h=200&fit=crop',
        category: 'Ice Cream'
    },
    {
        _id: '21',
        name: 'Kulfi',
        description: 'Traditional Indian frozen dessert with cardamom and pistachios.',
        price: 950.00,
        originalPrice: 1200.00,
        discount: 21,
        rating: 4.7,
        reviews: 189,
        imageURL: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop',
        category: 'Ice Cream'
    }
];

// Home Page
router.get('/', (req, res) => res.render('home'));

// Menu Page
router.get('/menu', (req, res) => {
    res.render('menu', { desserts });
});

// About Page
router.get('/about', (req, res) => res.render('about'));

// Contact Page
router.get('/contact', (req, res) => res.render('contact'));

// Order Page
router.get('/order', (req, res) => {
    res.render('order', { desserts });
});

// Cart Page
router.get('/cart', (req, res) => {
    res.render('cart');
});

// Checkout Page
router.get('/checkout', (req, res) => {
    res.render('checkout');
});

// API to get all desserts
router.get('/api/desserts', (req, res) => {
    res.json(desserts);
});

// API to submit an order
router.post('/api/order', (req, res) => {
    const { customer, address, paymentMethod, items, total } = req.body;

    // Validate required fields
    if (!customer || !customer.firstName || !customer.email || !items || items.length === 0) {
        return res.status(400).json({ msg: 'Please fill in all required fields and ensure cart is not empty' });
    }

    // Create order object
    const order = {
        orderId: 'SC' + Date.now(),
        customer: customer,
        address: address,
        paymentMethod: paymentMethod,
        items: items,
        total: total,
        status: 'confirmed',
        orderDate: new Date().toISOString()
    };

    console.log('New Order Received:');
    console.log('==================');
    console.log(`Order ID: ${order.orderId}`);
    console.log(`Customer: ${customer.firstName} ${customer.lastName}`);
    console.log(`Email: ${customer.email}`);
    console.log(`Phone: ${customer.phone}`);
    console.log(`Address: ${address.street}, ${address.city} ${address.zipCode}`);
    console.log(`Payment: ${paymentMethod}`);
    console.log('Items:');
    items.forEach(item => {
        console.log(`  - ${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`);
    });
    console.log(`Total: $${total.toFixed(2)}`);
    console.log('==================\n');

    res.json({ 
        msg: 'Order received successfully!',
        orderId: order.orderId,
        estimatedDelivery: '30-45 minutes'
    });
});

module.exports = router;

