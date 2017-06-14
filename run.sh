source secrets.env

# create a symlink to ourself so we can point fliteral to our app
ln -s `pwd` test/literals/chatfuel-google-sheet

export LITERAL_PATH=`pwd`/test/literals/

# debug by swapping the commented lines
# node --debug-brk --inspect node_modules/fliteral
node node_modules/fliteral
