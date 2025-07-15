# 🦀 move2ts

A CLI tool to generate TypeScript interfaces from **Move** smart contract structs.

No more manual typing or guessing field names in your frontend — plug this in, and let it convert your `.move` structs to clean, type-safe TS interfaces in one go.

---

## ✨ What It Does

This tool:

- Parses a single `.move` source file
- Extracts all `public struct` definitions
- Create a `types/` directory** in your project root if you don't pass in the output directory and also if `types/` doesn't exist before.
- Generates a single `.ts` file with TypeScript interfaces for all the structs in that Move file

---

## 🔧 Example Command

```bash
npx move2ts extract --target ./contracts/auction.move --print_to ./frontend/
```

---

## How Type Conversion Works

This process involves reading your Move source file, parsing its public structs, and then generating a corresponding TypeScript file.

Here's a breakdown:

* **Read the Move source file** at `./contracts/auction.move`
* **Parse all public structs** defined within the file.
* **Create a `types/` folder** in your project root if you don't pass in the output directory and also if `type/` doesn't exist.
* **Write a file**: `types/auction.ts` containing all the exported TypeScript interfaces.

---

### 🧠 How Type Conversion Works

#### 📥 Input: Move Struct

```move
public struct BidEntry has store, drop, copy {
    bidder: address,
    amount: u64,
    timestamp: u64,
}
```
### 📤 Output: TypeScript Interface

```typescript
export interface BidEntry {
  bidder: string;
  amount: number;
  timestamp: number;
}
```

---

## ✍️ Author

**Name:** Adekola Abdulhakeem  
**Alias:** SAGHE_DEV  
**GitHub:** [@SAGHEDEV](https://github.com/SAGHEDEV)

---