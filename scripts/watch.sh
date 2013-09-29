#!/bin/bash
 
JS_PATH="frontend/javascripts"
FINAL_JS="assets/script.js"
 
SASS_PATH="frontend/stylesheets"
FINAL_CSS="assets"
 
sha=0
previous_sha=0
 
update_sha()
{
    sha=`ls -lRT $JS_PATH $SASS_PATH | gsha1sum`
}
 
build () {
    # Build/make commands here
    rm $FINAL_JS
    touch $FINAL_JS
    cat $JS_PATH/*.js >> $FINAL_JS
    echo "  \033[0;32m$FINAL_JS\033[0m"
    sass -r sass-globbing --update $SASS_PATH:$FINAL_CSS
}
 
changed () {
    echo " ≫ Change detected. Rebuilding..."
    build
    previous_sha=$sha
}
 
compare () {
    update_sha
    if [ "$sha" != "$previous_sha" ] ; then changed; fi
}
 
run () {
    update_sha
    previous_sha=$sha
    while true; do
 
        compare
 
        read -s -t 1 && (
            echo " ≫ Forced rebuild..."
            build
        )
 
    done
}
 
echo " ≫ Watching for changes. Press Ctrl-C to stop."
 
run