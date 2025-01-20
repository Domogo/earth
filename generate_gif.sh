#!/bin/bash
# ./generate_gif.sh 2025-01-19
date=$1
ffmpeg -framerate 10 -pattern_type glob -i "img/$date/*.png" -vf scale=320:-1 "img/$date/output.gif"