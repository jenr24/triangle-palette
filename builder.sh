source $stdenv/setup

buildPhase() {
  npm run build
}

installPhase() {
  echo "No Install Phase..."
}

runPhase() {
  npm run start
}

genericBuild