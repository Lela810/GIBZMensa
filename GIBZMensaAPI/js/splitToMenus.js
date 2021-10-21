const menuTypes = [
    "Tagesmenü",
    "Vegimenü",
    "Hit",
    "Topping des Tages"
]

function split(...menuStrings) {
    for (const menuType of menuTypes) {
        menuStrings = menuStrings.map(menu => menu.split(menuType)).flat()
    }

    menuStrings = menuStrings.slice(1).map(menu => menu.trim())

    const menus = {}

    for (let i = 0; i < menuTypes.length; i++) {
        menus[menuTypes[i]] = menuStrings[i]
    }

    return menus
}

module.exports = { split };