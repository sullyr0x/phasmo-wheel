# Phasmo-Wheel App

A small utility to make using the Phasmo-Wheel options more fun.

To learn more, check out the Discord: https://discord.gg/UPEceAz

## Quick Start

    npm install
    npm start
    
And it'll be served on `http://localhost:8000`

## Development

    npm install
    npm run start:watch
    
And it'll be served on `http://localhost:8000` and automatically
restart if there are any changes.

## Data

Data is found in the `data` folder. It is broken into 3 files:

- `team-rules.json` has Team rules
- `personal-rules.json` has Personal rules
- `items.json` has item data

### Rule Data

The format for rules (both Team and Personal) is:

    {
      "id": 1
      "name": "Name",
      "summary": "Short explainer",
      "description": "Lengthier description",
      "weight": 1.0,
      "restrict": {
        "item-id": 1
      },
      "reduce": {
        "item-id": 1
      }
    } 
    
The values are:

- `id`: A power-of-2 ID unique to the ruleset.
- `name`: The name of the rule to show on and under the wheel.
- `summary`: A brief summary of the rule.
- `description`: A longer description of the rule. Supports HTML.
- `weight`: Optional, defaults to `1.0`. The weight/chance of this rule 
    compared to others. Larger number means more likely to occur.
- `restrict`: Optional. Usually used for Team rules. 
    Indicates which items are restricted and to what quantity. 
    Used to calculate the Items to Bring.
    
    E.g., EMP prevents the use of basic and strong flashlights, so they would be set
    to 0, while it only allows 1 candle for the team, so that'd be set to 1.
- `reduce`: Optional. Usually used for Personal rules.
    Indicates which items to reduce and by what quantity.
    
    E.g., Candle Only means the player can only use a candle, so they don't
    need a strong, uv, or basic flashlight, meaning those are both set to 1 to reduce.
    
    
### Item Data

The format for items is:

    {
      "id": "short-name",
      "name": "Display Name",
      "min": 0,
      "max": 4
    }
    
The values are:

- `id`: A short name, used to reference them in rules `restrict`.
- `name`: The proper name to display for the item.
- `min`: The minimum quantity the game allows you to bring.
- `max`: The maximum quantity the game allows you to bring.