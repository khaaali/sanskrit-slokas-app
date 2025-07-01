# Error Log

**Date:** 2024-06-09

## 1. TypeScript/ESLint 'any' Type Errors
- **Error:** Usage of `any` type in multiple files (e.g., `.find((col: any) => ...)`, `catch (err: any)`, etc.).
- **Resolution:** Replaced all `any` usages with explicit types (`SlokaGroup`, `FlattenedSloka`, `unknown` for errors) and updated array/object types accordingly.

## 2. Unused Variable Linter Errors
- **Error:** Variables like `pathname`, `clientPayload`, `blob`, and `tokenPayload` were defined but never used in API route handlers.
- **Resolution:** Prefixed unused variables with underscores (e.g., `_pathname`) to satisfy the linter.

## 3. Module Not Found Errors
- **Error:** `Cannot find module '../../lib/data' or its corresponding type declarations.`
- **Resolution:** Ensured the file `src/lib/data.ts` exists, used correct relative import paths, and restarted the IDE/dev server to clear cache.

## 4. Type Mismatch in .find() Callback
- **Error:** Type error when using `.find((col: SlokaGroup) => ...)` due to the return type of `getCollectionsWithSlokas()`.
- **Resolution:** Cast the result of `getCollectionsWithSlokas()` to `SlokaGroup[]` before using `.find()`.

## 5. Duplicate/Confusing Project Structure
- **Error:** Existence of two `src` folders (one at project root, one in `sanskrit-slokas-app/`).
- **Resolution:** Deleted the root-level `src` folder and ensured all code lives in `sanskrit-slokas-app/src`.

## 6. Git Push Upstream Error
- **Error:** `fatal: The current branch updating-vishnu has no upstream branch.`
- **Resolution:** Used `git push --set-upstream origin updating-vishnu` to set the upstream branch.

---

**Result:**
All major TypeScript, ESLint, and project structure errors were resolved, resulting in a clean, type-safe, and maintainable codebase. 