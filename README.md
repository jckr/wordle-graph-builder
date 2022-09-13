# Wordle graph builder

This is a node CLI program to generate graphs of recommended moves with the game Wordle. 

Each time a player types in a word in the game, they get a score which signals how many letters they entered are "missing" from the solution, "present" in the solution but at a different location and "correct" - they appear in the solution at the same location. 

A wordle graph is a tree that starts from a possible word, and which, for every possible score that the player may get for that word, will associate one word to play next. And for every possible score that this word may get, one next move, and so on and so forth until the player reaches the solution. 

This graph builder uses some heuristics to evaluate all possible words so that the next move is, maybe not the very best, but at least reasonable. 

