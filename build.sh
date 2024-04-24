#!/bin/bash

# Copyright(c) 2024 Alex313031

YEL='\033[1;33m' # Yellow
CYA='\033[1;96m' # Cyan
RED='\033[1;31m' # Red
GRE='\033[1;32m' # Green
c0='\033[0m' # Reset Text
bold='\033[1m' # Bold Text
underline='\033[4m' # Underline Text

# Error handling
yell() { echo "$0: $*" >&2; }
die() { yell "$*"; exit 111; }
try() { "$@" || die "${RED}Failed $*"; }

# --help
displayHelp () {
	printf "\n" &&
	printf "${bold}${GRE}Script to build Etcher-ng on Windows.${c0}\n" &&
	printf "${bold}${YEL}Use the --deps flag to install build dependencies.${c0}\n" &&
	printf "${bold}${YEL}Use the --clean flag to run \`npm run clean\`.${c0}\n" &&
	printf "${bold}${YEL}Use the --build flag to build Etcher-ng.${c0}\n" &&
	printf "${bold}${YEL}Use the --build-avx flag to build Etcher-ng (AVX Version).${c0}\n" &&
	printf "${bold}${YEL}Use the --dist flag to generate installation packages.${c0}\n" &&
	printf "${bold}${YEL}Use the --dist-avx flag to generate installation packages for AVX version.${c0}\n" &&
	printf "${bold}${YEL}Use the --help flag to show this help.${c0}\n" &&
	printf "\n"
}
case $1 in
	--help) displayHelp; exit 0;;
esac

# Install prerequisites
installDeps () {
	sudo apt-get install build-essential curl git g++ pkg-config automake make gcc libsecret-1-dev \
	fakeroot rpm dpkg dpkg-dev libkrb5-dev libx11-dev libxkbfile-dev jq python3 libudev-dev
}
case $1 in
	--deps) installDeps; exit 0;;
esac

cleanEtcher () {
	printf "\n" &&
	printf "${bold}${YEL} Cleaning artifacts and build directory...${c0}\n" &&
	
	npm run clean
}
case $1 in
	--clean) cleanEtcher; exit 0;;
esac

buildEtcher () {
# Optimization parameters
export CFLAGS="/O2 -msse3 -O3 -g0 -s -Wno-deprecated-declarations -Wno-unused-variable -Wno-unused-result -Wno-implicit-fallthrough -Wno-maybe-uninitialized -Wno-cast-function-type" &&
export CXXFLAGS="/O2 -msse3 -O3 -g0 -s -Wno-deprecated-declarations -Wno-unused-variable -Wno-unused-result -Wno-implicit-fallthrough -Wno-maybe-uninitialized -Wno-cast-function-type" &&
export CPPFLAGS="/O2 -msse3 -O3 -g0 -s -Wno-deprecated-declarations -Wno-unused-variable -Wno-unused-result -Wno-implicit-fallthrough -Wno-maybe-uninitialized -Wno-cast-function-type" &&
export LDFLAGS="-Wl,-O3 -msse3 -s" &&
export VERBOSE=1 &&
export V=1 &&

printf "${CYA}\n" &&
printf " CFLAGS: $CFLAGS\n" &&
printf " CXXFLAGS: $CXXFLAGS\n" &&
printf " CPPFLAGS: $CPPFLAGS\n" &&
printf " LDFLAGS: $LDFLAGS${c0}\n" &&

# Set msvs_version for node-gyp on Windows
export MSVS_VERSION="2019" &&
export GYP_MSVS_VERSION="2019" &&
# Download electron binaries here
export ELECTRON_CACHE="${PWD}/electron" &&
export electron_config_cache="${PWD}/electron" &&

printf "\n" &&
printf "${bold}${GRE} Building Etcher-ng...${c0}\n" &&

npm run build
}
case $1 in
	--build) buildEtcher; exit 0;;
esac

buildEtcherAVX () {
# Optimization parameters
export CFLAGS="/O2 /arch:AVX -msse3 -mssse3 -msse4.1 -msse4.2 -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-unused-variable -Wno-unused-result -Wno-implicit-fallthrough -Wno-maybe-uninitialized -Wno-cast-function-type" &&
export CXXFLAGS="/O2 /arch:AVX -msse3 -mssse3 -msse4.1 -msse4.2 -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-unused-variable -Wno-unused-result -Wno-implicit-fallthrough -Wno-maybe-uninitialized -Wno-cast-function-type" &&
export CPPFLAGS="/O2 /arch:AVX -msse3 -mssse3 -msse4.1 -msse4.2 -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-unused-variable -Wno-unused-result -Wno-implicit-fallthrough -Wno-maybe-uninitialized -Wno-cast-function-type" &&
export LDFLAGS="-Wl,-O3 -msse3 -mssse3 -msse4.1 -msse4.2 -mavx -maes -s" &&
export VERBOSE=1 &&
export V=1 &&

printf "${CYA}\n" &&
printf " CFLAGS: $CFLAGS\n" &&
printf " CXXFLAGS: $CXXFLAGS\n" &&
printf " CPPFLAGS: $CPPFLAGS\n" &&
printf " LDFLAGS: $LDFLAGS${c0}\n" &&

# Set msvs_version for node-gyp on Windows
export MSVS_VERSION="2019" &&
export GYP_MSVS_VERSION="2019" &&
# Download electron binaries here
export ELECTRON_CACHE="${PWD}/electron" &&
export electron_config_cache="${PWD}/electron" &&

printf "\n" &&
printf "${bold}${GRE} Building Etcher-ng (AVX Version)...${c0}\n" &&

npm run build
}
case $1 in
	--build-avx) buildEtcherAVX; exit 0;;
esac

packageEtcher () {
# Optimization parameters
export CFLAGS="/O2 -msse3 -O3 -g0 -s -Wno-deprecated-declarations -Wno-unused-variable -Wno-unused-result -Wno-implicit-fallthrough -Wno-maybe-uninitialized -Wno-cast-function-type" &&
export CXXFLAGS="/O2 -msse3 -O3 -g0 -s -Wno-deprecated-declarations -Wno-unused-variable -Wno-unused-result -Wno-implicit-fallthrough -Wno-maybe-uninitialized -Wno-cast-function-type" &&
export CPPFLAGS="/O2 -msse3 -O3 -g0 -s -Wno-deprecated-declarations -Wno-unused-variable -Wno-unused-result -Wno-implicit-fallthrough -Wno-maybe-uninitialized -Wno-cast-function-type" &&
export LDFLAGS="-Wl,-O3 -msse3 -s" &&
export VERBOSE=1 &&
export V=1 &&

printf "${CYA}\n" &&
printf " CFLAGS: $CFLAGS\n" &&
printf " CXXFLAGS: $CXXFLAGS\n" &&
printf " CPPFLAGS: $CPPFLAGS\n" &&
printf " LDFLAGS: $LDFLAGS${c0}\n" &&

# Set msvs_version for node-gyp on Windows
export MSVS_VERSION="2019" &&
export GYP_MSVS_VERSION="2019" &&
# Download electron binaries here
export ELECTRON_CACHE="${PWD}/electron" &&
export electron_config_cache="${PWD}/electron" &&

printf "\n" &&
printf "${bold}${GRE} Generating installation packages...${c0}\n" &&

npm run dist
}
case $1 in
	--dist) packageEtcher; exit 0;;
esac

packageEtcherAVX () {
# Optimization parameters
export CFLAGS="/O2 /arch:AVX -msse3 -mssse3 -msse4.1 -msse4.2 -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-unused-variable -Wno-unused-result -Wno-implicit-fallthrough -Wno-maybe-uninitialized -Wno-cast-function-type" &&
export CXXFLAGS="/O2 /arch:AVX -msse3 -mssse3 -msse4.1 -msse4.2 -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-unused-variable -Wno-unused-result -Wno-implicit-fallthrough -Wno-maybe-uninitialized -Wno-cast-function-type" &&
export CPPFLAGS="/O2 /arch:AVX -msse3 -mssse3 -msse4.1 -msse4.2 -mavx -maes -O3 -g0 -s -Wno-deprecated-declarations -Wno-unused-variable -Wno-unused-result -Wno-implicit-fallthrough -Wno-maybe-uninitialized -Wno-cast-function-type" &&
export LDFLAGS="-Wl,-O3 -msse3 -mssse3 -msse4.1 -msse4.2 -mavx -maes -s" &&
export VERBOSE=1 &&
export V=1 &&

printf "${CYA}\n" &&
printf " CFLAGS: $CFLAGS\n" &&
printf " CXXFLAGS: $CXXFLAGS\n" &&
printf " CPPFLAGS: $CPPFLAGS\n" &&
printf " LDFLAGS: $LDFLAGS${c0}\n" &&

# Set msvs_version for node-gyp on Windows
export MSVS_VERSION="2019" &&
export GYP_MSVS_VERSION="2019" &&
# Download electron binaries here
export ELECTRON_CACHE="${PWD}/electron" &&
export electron_config_cache="${PWD}/electron" &&

printf "\n" &&
printf "${bold}${GRE} Generating installation packages (AVX Version)...${c0}\n" &&

npm run dist
}
case $1 in
	--dist-avx) packageEtcherAVX; exit 0;;
esac

printf "\n" &&
printf "${bold}${GRE}Script to build Etcher-ng on Windows.${c0}\n" &&
printf "${bold}${YEL}Use the --deps flag to install build dependencies.${c0}\n" &&
printf "${bold}${YEL}Use the --clean flag to run \`npm run clean\`.${c0}\n" &&
printf "${bold}${YEL}Use the --build flag to build Etcher-ng.${c0}\n" &&
printf "${bold}${YEL}Use the --build-avx flag to build Etcher-ng (AVX Version).${c0}\n" &&
printf "${bold}${YEL}Use the --dist flag to generate installation packages.${c0}\n" &&
printf "${bold}${YEL}Use the --dist-avx flag to generate installation packages for AVX version.${c0}\n" &&
printf "${bold}${YEL}Use the --help flag to show this help.${c0}\n" &&
printf "\n" &&
tput sgr0
