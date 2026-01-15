
# Diet Matrix Data
# Structure: DOSHA -> SLEEP_STATE_INDEX (0-4) -> { eat: [], avoid: [] }

DIET_MATRIX = {
    "Vata": {
        0: { # Normal
            "eat": ["Warm milk", "ghee", "rice", "wheat chapati", "cooked vegetables", "moong dal", "dates", "figs", "soaked almonds"],
            "avoid": ["Cold food", "raw salad", "popcorn", "soda", "ice cream", "cold milk", "packaged snacks", "dry cereals"]
        },
        1: { # Disturbed
            "eat": ["Vegetable soup", "khichdi", "milk + ashwagandha", "stewed apple", "ghee rice", "warm herbal tea"],
            "avoid": ["Tea", "coffee", "biscuits", "chips", "bakery items", "fasting", "cold water", "reheated food"]
        },
        2: { # Insomnia-like
            "eat": ["Milk + nutmeg", "porridge", "oats", "banana", "dates", "pumpkin", "rice gruel", "cooked carrot"],
            "avoid": ["Dry snacks", "toast", "crackers", "caffeine", "frozen food", "cornflakes", "night tea"]
        },
        3: { # Apnea-like
            "eat": ["Warm milk", "ghee", "soft rice", "vegetable broth", "moong dal soup", "boiled vegetables"],
            "avoid": ["Cold drinks", "fried food", "raw vegetables", "heavy meat", "cheese", "curd at night"]
        },
        4: { # Awake
            "eat": ["Warm milk", "banana", "figs", "soaked almonds", "rice porridge", "herbal tea"],
            "avoid": ["Skipping dinner", "caffeine", "spicy snacks", "energy drinks", "cold desserts"]
        }
    },
    "Pitta": {
        0: { # Normal
            "eat": ["Coconut water", "milk", "sweet fruits", "rice", "cucumber", "pumpkin", "bottle gourd", "ghee"],
            "avoid": ["Chili", "fried food", "pickles", "vinegar", "garlic excess", "salty snacks", "sauces"]
        },
        1: { # Disturbed
            "eat": ["Fennel tea", "coriander water", "rose milk", "soaked raisins", "barley"],
            "avoid": ["Spicy food", "fried snacks", "sour fruits", "packaged sauces", "excess salt"]
        },
        2: { # Insomnia-like
            "eat": ["Aloe vera juice", "rose milk", "coconut milk", "oats", "bottle gourd", "ash gourd"],
            "avoid": ["Alcohol", "chili", "fermented food", "onion excess", "tomatoes", "curd at night"]
        },
        3: { # Apnea-like
            "eat": ["Turmeric milk", "barley", "oats", "rice gruel", "steamed vegetables", "coriander soup"],
            "avoid": ["Late dinner", "oily food", "red meat", "spicy curries", "cheese", "packaged food"]
        },
        4: { # Awake
            "eat": ["Coconut water", "grapes", "watermelon", "pear", "apple"],
            "avoid": ["Heavy meals", "spicy food", "tea", "coffee", "chocolate", "junk food"]
        }
    },
    "Kapha": {
        0: { # Normal
            "eat": ["Light dinner", "vegetable soup", "steamed vegetables", "millet", "barley", "warm water"],
            "avoid": ["Dairy at night", "sweets", "rice excess", "curd", "banana at night", "oily food"]
        },
        1: { # Disturbed
            "eat": ["Ginger tea", "moong dal", "steamed food", "vegetable broth"],
            "avoid": ["Cheese", "cold drinks", "ice cream", "sugar", "bakery items"]
        },
        2: { # Insomnia-like
            "eat": ["Herbal tea", "millet porridge", "barley soup", "roasted vegetables"],
            "avoid": ["Rice at night", "potatoes", "sweets", "chocolate", "deep-fried snacks"]
        },
        3: { # Apnea-like
            "eat": ["Very light dinner", "ginger", "black pepper", "turmeric", "vegetable soup"],
            "avoid": ["Dairy", "sugar", "fried food", "heavy grains", "alcohol", "late meals"]
        },
        4: { # Awake
            "eat": ["Warm water", "light soup", "steamed vegetables"],
            "avoid": ["Heavy dinner", "dairy", "sweets", "rice", "oily snacks"]
        }
    }
}

SLEEP_STATE_MAP = {
    "Normal sleep": 0,
    "Disturbed sleep": 1,
    "Insomnia-like sleep": 2,
    "Apnea-like pattern": 3,
    "Awake": 4
}
