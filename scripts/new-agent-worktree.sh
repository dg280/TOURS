#!/usr/bin/env bash
# new-agent-worktree.sh — Crée un worktree isolé pour un agent Claude Code
#
# Usage : ./scripts/new-agent-worktree.sh <nom-de-la-feature>
# Exemple : ./scripts/new-agent-worktree.sh refacto-navbar
#
# Ce script garantit qu'un agent travaille sur une branche dédiée
# sans jamais toucher à main ni aux autres worktrees.

set -e

FEATURE=${1:-"agent-$(date +%Y%m%d-%H%M%S)"}
BRANCH="agent/${FEATURE}"
WORKTREE_DIR=".worktrees/${FEATURE}"

# Vérification : on doit être à la racine du repo
if [ ! -f "CLAUDE.md" ]; then
  echo "❌ Ce script doit être exécuté depuis la racine du projet."
  exit 1
fi

# Créer le répertoire parent si nécessaire
mkdir -p .worktrees

# Vérifier si la branche existe déjà
if git show-ref --verify --quiet "refs/heads/${BRANCH}"; then
  echo "⚠️  La branche ${BRANCH} existe déjà. Connexion au worktree existant..."
  if [ -d "${WORKTREE_DIR}" ]; then
    echo "✅ Worktree déjà présent : ${WORKTREE_DIR}"
  else
    git worktree add "${WORKTREE_DIR}" "${BRANCH}"
    echo "✅ Worktree recréé : ${WORKTREE_DIR}"
  fi
else
  # Créer la branche et le worktree depuis main
  git fetch origin main --quiet
  git worktree add -b "${BRANCH}" "${WORKTREE_DIR}" origin/main
  echo "✅ Nouveau worktree créé : ${WORKTREE_DIR}"
  echo "   Branche : ${BRANCH}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Pour lancer Claude Code dans ce worktree :"
echo "  cd ${WORKTREE_DIR} && claude"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Quand le travail est terminé, créer une PR sur GitHub :"
echo "  gh pr create --base main --head ${BRANCH}"
echo ""
