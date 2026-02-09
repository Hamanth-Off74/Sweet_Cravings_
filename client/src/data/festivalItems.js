// Festival Special Items Data
// Each festival has specific desserts/combos associated with it

export const FESTIVAL_SPECIAL_ITEMS = {
    diwali: {
        name: "Diwali",
        emoji: "🪔",
        color: "#FF9800",
        gradient: "linear-gradient(135deg, #FFB300 0%, #FF8F00 100%)",
        items: [
            "Kaju Katli",
            "Motichoor Laddu",
            "Mysore Pak",
            "Dry Fruit Sweet Box",
            "Chocolate Burfi"
        ]
    },

    holi: {
        name: "Holi",
        emoji: "🌈",
        color: "#E91E63",
        gradient: "linear-gradient(135deg, #FF4081 0%, #E91E63 100%)",
        items: [
            "Gujiya",
            "Malpua",
            "Thandai Dessert",
            "Colorful Sweet Box"
        ]
    },

    raksha_bandhan: {
        name: "Raksha Bandhan",
        emoji: "🎀",
        color: "#9C27B0",
        gradient: "linear-gradient(135deg, #BA68C8 0%, #9C27B0 100%)",
        items: [
            "Rakhi Special Sweet Box",
            "Chocolate Gift Box",
            "Dry Fruit Mithai",
            "Cupcake Combo"
        ]
    },

    janmashtami: {
        name: "Janmashtami",
        emoji: "🦚",
        color: "#2196F3",
        gradient: "linear-gradient(135deg, #64B5F6 0%, #1976D2 100%)",
        items: [
            "Makhan Mishri",
            "Peda",
            "Butter Cookies",
            "Milk Sweets Box"
        ]
    },

    ganesh_chaturthi: {
        name: "Ganesh Chaturthi",
        emoji: "🐘",
        color: "#FF5722",
        gradient: "linear-gradient(135deg, #FF8A65 0%, #E64A19 100%)",
        items: [
            "Modak",
            "Ukadiche Modak",
            "Chocolate Modak",
            "Coconut Laddu"
        ]
    },

    navratri: {
        name: "Navratri",
        emoji: "💃",
        color: "#F44336",
        gradient: "linear-gradient(135deg, #EF5350 0%, #C62828 100%)",
        items: [
            "Sabudana Kheer",
            "Dry Fruit Ladoo",
            "Falahari Sweets",
            "Milk-Based Desserts"
        ]
    },

    dussehra: {
        name: "Dussehra",
        emoji: "🏹",
        color: "#FF5722",
        gradient: "linear-gradient(135deg, #FF7043 0%, #D84315 100%)",
        items: [
            "Jalebi",
            "Mysore Pak",
            "Sweet Combo Box",
            "Festive Dessert Platter"
        ]
    },

    pongal: {
        name: "Pongal",
        emoji: "🌾",
        color: "#CDDC39",
        gradient: "linear-gradient(135deg, #DCE775 0%, #AFB42B 100%)",
        items: [
            "Sweet Pongal",
            "Coconut Laddu",
            "Jaggery Sweets"
        ]
    },

    onam: {
        name: "Onam",
        emoji: "🌺",
        color: "#FFC107",
        gradient: "linear-gradient(135deg, #FFD54F 0%, #FFA000 100%)",
        items: [
            "Payasam",
            "Ada Pradhaman",
            "Coconut Sweets",
            "Kerala Dessert Box"
        ]
    },

    maha_shivratri: {
        name: "Maha Shivratri",
        emoji: "🔱",
        color: "#3F51B5",
        gradient: "linear-gradient(135deg, #7986CB 0%, #303F9F 100%)",
        items: [
            "Fruit Dessert Bowl",
            "Milk-Based Sweets",
            "Dry Fruits Mix"
        ]
    },

    ugadi: {
        name: "Ugadi",
        emoji: "🥭",
        color: "#8BC34A",
        gradient: "linear-gradient(135deg, #AED581 0%, #689F38 100%)",
        items: [
            "Ugadi Pachadi",
            "Bobbatlu (Puran Poli)",
            "Sweet Combo Box"
        ]
    },

    rama_navami: {
        name: "Rama Navami",
        emoji: "🙏",
        color: "#FF9800",
        gradient: "linear-gradient(135deg, #FFB74D 0%, #F57C00 100%)",
        items: [
            "Panakam",
            "Kosambari Sweet",
            "Milk Sweets"
        ]
    },

    krishna_jayanthi: {
        name: "Krishna Jayanthi",
        emoji: "🧈",
        color: "#03A9F4",
        gradient: "linear-gradient(135deg, #4FC3F7 0%, #0288D1 100%)",
        items: [
            "Seedai",
            "Butter Cookies",
            "Sweet Appam"
        ]
    },

    christmas: {
        name: "Christmas",
        emoji: "🎄",
        color: "#4CAF50",
        gradient: "linear-gradient(135deg, #66BB6A 0%, #388E3C 100%)",
        items: [
            "Plum Cake",
            "Christmas Cupcake",
            "Choco Cookies",
            "Brownies",
            "Pastry Box"
        ]
    },

    new_year: {
        name: "New Year",
        emoji: "🎆",
        color: "#673AB7",
        gradient: "linear-gradient(135deg, #9575CD 0%, #512DA8 100%)",
        items: [
            "Celebration Cake",
            "Party Cupcakes",
            "Sweet Hamper",
            "Chocolate Box",
            "Dessert Platter"
        ]
    },

    valentines: {
        name: "Valentine's Day",
        emoji: "❤️",
        color: "#E91E63",
        gradient: "linear-gradient(135deg, #F06292 0%, #C2185B 100%)",
        items: [
            "Heart Shaped Cake",
            "Red Velvet Cupcakes",
            "Chocolate Truffle Box",
            "Love Sweet Box"
        ]
    }
};

export const FESTIVAL_OPTIONS = Object.keys(FESTIVAL_SPECIAL_ITEMS).map(key => ({
    value: key,
    label: `${FESTIVAL_SPECIAL_ITEMS[key].emoji} ${FESTIVAL_SPECIAL_ITEMS[key].name}`,
    ...FESTIVAL_SPECIAL_ITEMS[key]
}));

export default FESTIVAL_SPECIAL_ITEMS;
