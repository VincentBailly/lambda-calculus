const code = `
((l K
  ((l TRUE
    ((l FALSE
      ((l I
        ((l S
          ((l NOT
            ((l AND
              ((l OR
                ((l BEQ?
                  ((l XOR 
                    ((l PAIR 
                      ((l FIRST 
                        ((l SECOND 
                          ((l NIL 
                            ((l NULL 
                              (PAIR print_bool 
                                (PAIR (XOR TRUE FALSE)
                                  NIL
                                )
                              )
                            ) (l p (p (l x (l y FALSE)))))
                          ) (l x TRUE))
                        ) (l p (p FALSE)))
		      ) (l p (p TRUE)))
	            ) (l a (l b (l f (f a b)))))
	          ) (l a (l b (a (NOT b) b))))
	        ) (l a (l b (a b (NOT b)))))
	      ) (l a (l b (a a b))))
	    ) (l a (l b (a b a))))
          ) (l a (a FALSE TRUE)))
        ) (l x (l y (l z ((x z) (y z)))))) 
      ) (l a a)) 
    ) (l a (l b b))) 
  ) K)
) (l a (l b a)))
`

function normalizeCode (code) {
	return code.replace(/\n/g, "")
		.replace(/\(/g, " ( ")
		.replace(/\)/g, " ) ")
		.split(" ")
		.filter(o => o !== "")
}

function createTree(tokens) {
	return tokens.reduce((acc, token) => {
		if (token === "(") {
			return { children: [], parent: acc }
		} else if (token === ")") {
			return {...acc.parent,
				children: [...acc.parent.children,
					   acc.children]}
		} else {
			return {...acc, children: [...acc.children,token]}
		}
	}, {children: []}).children[0]

}

function parse(code) {
	const tokens = normalizeCode(code)
	const tree = createTree(tokens)
	return tree
}

function eval(tree, env) {
	if (typeof tree === "string") { // var
		return env(tree)
	} else if (tree[0] === "l") { // lambda
		return arg => eval(tree[2], (x) => { return x === tree[1] ? arg : env(x) })
	} else { // function application
		return tree.slice(1).reduce((acc, next) => acc(eval(next, env)), eval(tree[0], env))
	}
}

// We define the symbols that the program can use to talk to us.
const printBool = Symbol("print bool")
const env = (x) => {
	if (x === "print_bool") {
		return printBool 
	} else {
		throw new Error(`Unbound variable: ${x}`)
	}
}

const result = eval(parse(code), env)

function toList(r) { // convert a "lambda calculus list" to a JS list
	if (r(a => b => "false") === "false") {
		const first = r(a => b => a)
		const second = r(a => b => b)
		return [first, ...toList(second)]
	} else {
		return []
	}
}

function renderBool(bool) { // converts "lambda calculus boolean" to JS string
	return bool("true")("false")
}

function playEffect(list) {
	list.reduce((acc, next) => {
			if (acc === printBool) {
				console.log(renderBool(next))
			}
		        return next
		})
}

playEffect(toList(result))
