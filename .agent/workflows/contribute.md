---
description: Help Antoine create a branch and safely fix a bug
---

# Workflow Contribution (Antoine)

This workflow helps a non-developer contributor change code without breaking the site.

1. **Isolation**: Always create a separate branch.
   - Ask the user: "What is the bug name?"
   - Run: `git checkout -b antoine/fix-[bug-name]`
2. **Development**:
   - Analyze the reported problem.
   - Apply changes in the relevant files.
3. **Safety (regression prevention)**:
   // turbo
   - Run: `npm run test`
   - If tests fail, fix errors until they pass.
4. **Publication**:
   - Run: `git add .`
   - Run: `git commit -m "fix(antoine): [bug description]"`
   - Run: `git push origin antoine/fix-[bug-name]`
5. **Completion**:
   - Ask the administrator, Dorian, to review the GitHub pull request.
