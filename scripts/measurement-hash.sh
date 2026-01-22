#!/bin/bash

set -euo pipefail

SCRIPT_PATH=$(dirname $(realpath $0))
ROOT_PATH="$SCRIPT_PATH/../"
DOCKER_COMPOSE_HASH=1d371953fa04141c6385380bde4e9074689def05c4cf9b0d023c737dec278d8c
VCPUS=1
NILCC_VERSION=0.3.0
NILCC_VERIFIER_VERSION=0.4.0

MEASUREMENT_HASH=$(docker run -v/tmp/nilcc-verifier-cache:/tmp/nilcc-verifier-cache --rm ghcr.io/nillionnetwork/nilcc-verifier:$NILCC_VERIFIER_VERSION measurement-hash $DOCKER_COMPOSE_HASH $NILCC_VERSION --vm-type cpu --cpus $VCPUS)
echo "$MEASUREMENT_HASH"
